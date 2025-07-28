import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "../ui/Button";
import {
  getHalakaProgress,
  updateHalakaProgress,
} from "../../Api/halakaProgress";
import Toast from "../shared/toast/Toast";
import Loading from "../shared/loading/Loading";

const StarRating = ({ value, onChange, editable }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index + 1}
        className={`h-5 w-5 cursor-pointer transition-colors ${
          index + 1 <= value ? "text-yellow-400 fill-current" : "text-gray-300"
        } ${editable ? "hover:text-yellow-500" : ""}`}
        onClick={() => editable && onChange(index + 1)}
      />
    ))}
  </div>
);

function StudentsTabContent({ halakaId }) {
  const [progressData, setProgressData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [localProgress, setLocalProgress] = useState({});
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  useEffect(() => {
    if (!halakaId) return;
    setLoading(true);
    setError("");
    getHalakaProgress(halakaId)
      .then((res) => {
        setProgressData(res.data);
        if (!editMode) {
          const local = {};
          (res.data.studentProgress || []).forEach((student) => {
            local[student.studentId] = {};
            (student.progress || []).forEach((session) => {
              local[student.studentId][session.sessionNumber] = {
                score: session.score || 0,
                notes: session.notes || "",
                sessionDate: session.sessionDate,
                status: session.status,
              };
            });
          });
          setLocalProgress(local);
        }
      })
      .catch(() => setError("فشل في جلب تقدم الطلاب"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [halakaId]);

  const handleRateChange = (studentId, sessionNumber, value) => {
    setLocalProgress((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [sessionNumber]: {
          ...prev[studentId][sessionNumber],
          score: value,
        },
      },
    }));
  };

  const handleNoteChange = (studentId, sessionNumber, value) => {
    setLocalProgress((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [sessionNumber]: {
          ...prev[studentId][sessionNumber],
          notes: value,
        },
      },
    }));
  };

  const handleEdit = () => setEditMode(true);

  const handleSave = async () => {
    if (!progressData) return;
    setSaving(true);
    setError("");
    try {
      const promises = [];
      progressData.studentProgress.forEach((student) => {
        (student.progress || []).forEach((session) => {
          const localCell =
            localProgress[student.studentId][session.sessionNumber];
          if (
            localCell.score !== session.score ||
            localCell.notes !== session.notes
          ) {
            promises.push(
              updateHalakaProgress(halakaId, {
                studentId: student.studentId,
                sessionDate: localCell.sessionDate,
                score: localCell.score,
                notes: localCell.notes,
              })
            );
          }
        });
      });
      if (promises.length === 0) {
        setToastState({
          show: true,
          message: "لا يوجد تعديلات لحفظها",
          type: "info",
          duration: 2000,
        });
        setEditMode(false);
        return;
      }
      const results = await Promise.allSettled(promises);
      const allSuccess = results.every((r) => r.status === "fulfilled");
      const someFailed = results.some((r) => r.status === "rejected");
      if (allSuccess) {
        setToastState({
          show: true,
          message: "تم حفظ التقييمات بنجاح!",
          type: "success",
          duration: 2000,
        });
        setEditMode(false);
      } else if (someFailed) {
        setToastState({
          show: true,
          message: "تم حفظ التعديلات بنجاح!",
          type: "success",
          duration: 2000,
        });
        setEditMode(false);
      }
    } catch (e) {
      setError("فشل في حفظ التعديلات");
      setToastState({
        show: true,
        message: "فشل في حفظ التعديلات",
        type: "error",
        duration: 2000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-full">
      <div className="p-2 md:p-4 min-h-[300px] md:min-h-[400px] bg-white rounded-2xl shadow-md border border-gray-200 overflow-x-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 tracking-tight text-center md:text-right">
          تقدم الطلاب في الحلقة
        </h2>
        {loading && <Loading text="جاري التحميل..." />}
        {!loading && error && (
          <div className="text-red-600 font-bold mb-4 text-center">{error}</div>
        )}
        {!loading && progressData && (
          <>
            <div className="overflow-x-auto custom-scrollbar rounded-2xl shadow-inner bg-white mb-4">
              <table className="min-w-[700px] w-full border-separate border-spacing-0 text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-100 sticky top-0 z-10">
                    <th className="p-4 text-right font-extrabold text-gray-800 border-b-2 border-gray-200 text-base md:text-lg bg-white rounded-tr-2xl">
                      الطالب
                    </th>
                    {progressData.sessionsData.map((session, idx) => (
                      <th
                        key={session.sessionNumber}
                        className={`p-4 text-center font-bold border-b-2 border-gray-200 text-xs md:text-base bg-white ${
                          idx === progressData.sessionsData.length - 1
                            ? "rounded-tl-2xl"
                            : ""
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>سيشن {session.sessionNumber}</span>
                          <span className="text-xs text-gray-500 mt-1">
                            {session.sessionDate}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {progressData.studentProgress.map((student, sIdx) => (
                    <tr
                      key={student.studentId}
                      className={`border-b border-gray-100 transition-all ${
                        sIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50/30`}
                    >
                      <td className="p-4 font-bold text-gray-800 whitespace-nowrap text-xs md:text-lg drop-shadow-sm">
                        {student.fullName}
                      </td>
                      {progressData.sessionsData.map((session) => {
                        const cell =
                          localProgress[student.studentId]?.[
                            session.sessionNumber
                          ] || {};
                        return (
                          <td
                            key={session.sessionNumber}
                            className="p-2 text-center align-middle min-w-[140px]"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <StarRating
                                value={cell.score || 0}
                                onChange={(val) =>
                                  handleRateChange(
                                    student.studentId,
                                    session.sessionNumber,
                                    val
                                  )
                                }
                                editable={editMode && !saving}
                              />
                              <input
                                type="text"
                                value={cell.notes || ""}
                                onChange={(e) =>
                                  handleNoteChange(
                                    student.studentId,
                                    session.sessionNumber,
                                    e.target.value
                                  )
                                }
                                disabled={!editMode || saving}
                                placeholder="ملاحظة..."
                                className={`mt-1 px-2 md:px-3 text-black py-2 rounded-xl border-2 border-gray-200 text-xs w-24 md:w-36 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-inner transition-all ${
                                  editMode ? "bg-white" : "bg-gray-100"
                                }`}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row gap-3 justify-end items-center mt-4">
              {!editMode && (
                <Button
                  className={`bg-blue-200 text-gray-800 font-bold rounded-lg px-6 py-2 shadow-md hover:bg-blue-300 transition-all ${
                    saving || !progressData
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handleEdit}
                  disabled={saving || !progressData}
                >
                  تعديل
                </Button>
              )}
              {editMode && (
                <Button
                  className={`bg-gray-700 text-white font-bold rounded-lg px-6 py-2 shadow-md hover:bg-gray-900 transition-all ${
                    saving ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "...جارٍ الحفظ" : "حفظ"}
                </Button>
              )}
            </div>
          </>
        )}
        <Toast
          show={toastState.show}
          message={toastState.message}
          type={toastState.type}
          duration={toastState.duration}
          onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
        />
      </div>
    </div>
  );
}

export default StudentsTabContent;
