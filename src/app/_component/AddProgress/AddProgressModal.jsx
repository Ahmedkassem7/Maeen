import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "../../_component/ui/Button";
// import useAuthStore from "@/stores/AuthStore";
import {
  getHalakaProgress,
  updateHalakaProgress,
} from "../../Api/halakaProgress";
import Toast from "../shared/toast/Toast";

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

const AddProgressModal = ({ halakas = [] }) => {
  // const { user, token } = useAuthStore();
  const [selectedHalaka, setSelectedHalaka] = useState("");
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

  // عند اختيار حلقة جديدة فقط، جهز الـ localProgress
  useEffect(() => {
    if (!selectedHalaka) return;
    setLoading(true);
    setError("");
    getHalakaProgress(selectedHalaka)
      .then((res) => {
        setProgressData(res.data);
        // فقط إذا لم تكن في وضع التعديل، جهز الـ localProgress
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
  }, [selectedHalaka]);

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
              updateHalakaProgress(selectedHalaka, {
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

      // استخدم Promise.allSettled بدلاً من Promise.all
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <select
          className="rounded-lg border border-gray-300 px-4 py-2 text-base font-bold text-gray-700 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all min-w-[200px]"
          value={selectedHalaka}
          onChange={(e) => setSelectedHalaka(e.target.value)}
          disabled={loading}
        >
          <option value="">اختر الحلقة</option>
          {halakas.map((h) => (
            <option key={h._id || h.id} value={h._id || h.id}>
              {h.title || h.name}
            </option>
          ))}
        </select>
      </div>
      <div className="p-4 min-h-[400px] bg-white rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
          تقدم الطلاب في الحلقات
        </h2>
        {loading && (
          <div className="text-blue-700 font-bold text-lg py-10 text-center animate-pulse">
            جاري التحميل...
          </div>
        )}
        {!selectedHalaka && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-lg font-bold gap-2">
            <Star className="w-10 h-10 text-blue-200 mb-2" />
            يرجى اختيار الحلقة أولاً لعرض تقدم الطلاب
          </div>
        )}
        {!loading && progressData && selectedHalaka && (
          <>
            <div className="overflow-x-auto custom-scrollbar rounded-2xl shadow-inner bg-white mb-4">
              <table className="min-w-[700px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-100 sticky top-0 z-10">
                    <th className="p-4 text-right font-extrabold text-gray-800 border-b-2 border-gray-200 text-lg bg-white rounded-tr-2xl">
                      الطالب
                    </th>
                    {progressData.sessionsData.map((session, idx) => (
                      <th
                        key={session.sessionNumber}
                        className={`p-4 text-center font-bold border-b-2 border-gray-200 text-base bg-white ${
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
                      <td className="p-4 font-bold text-gray-800 whitespace-nowrap text-lg drop-shadow-sm">
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
                            className="p-2 text-center align-middle"
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
                                className={`mt-1 px-3 text-black py-2 rounded-xl border-2 border-gray-200 text-xs w-28 md:w-36 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-inner transition-all ${
                                  editMode ? "bg-white" : "bg-gray-100"
                                }`}
                              />
                              <span
                                className={`text-xs mt-1 font-bold ${
                                  cell.status === "absent"
                                    ? "text-red-500"
                                    : cell.status === "late"
                                    ? "text-yellow-600"
                                    : "text-green-600"
                                }`}
                              >
                                {cell.status === "absent"
                                  ? "غائب"
                                  : cell.status === "late"
                                  ? "متأخر"
                                  : cell.status === "present"
                                  ? "حاضر"
                                  : cell.status === "excused"
                                  ? "معذور"
                                  : ""}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3 justify-end">
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
};

export default AddProgressModal;
