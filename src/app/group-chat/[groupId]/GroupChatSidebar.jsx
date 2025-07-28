import React from "react";

const GroupChatSidebar = ({
  teacher,
  currentStudent,
  students,
  onlineUsers = [],
}) => {
  return (
    <aside className="w-full h-full flex flex-col bg-white rounded-s-xl overflow-hidden shadow-md border border-gray-100">
      {/* المعلم */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-center gap-2">
        <div className="relative">
          <img
            src={teacher?.profileImage || "/default-profile.jpg"}
            alt={teacher?.name}
            className="w-16 h-16 rounded-full border-4 border-blue-600 shadow-md object-cover"
          />
          <span className="absolute -top-2 -left-2 bg-blue-600 text-white rounded-full p-1 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.286 7.037a1 1 0 00.95.69h7.396c.969 0 1.371 1.24.588 1.81l-5.99 4.356a1 1 0 00-.364 1.118l2.287 7.036c.3.921-.755 1.688-1.54 1.118l-5.99-4.356a1 1 0 00-1.176 0l-5.99 4.356c-.784.57-1.838-.197-1.54-1.118l2.287-7.036a1 1 0 00-.364-1.118L2.03 12.464c-.783-.57-.38-1.81.588-1.81h7.396a1 1 0 00.95-.69l2.286-7.037z"
              />
            </svg>
          </span>
        </div>
        <div className="font-bold text-blue-900 text-lg">{teacher?.name}</div>
        <div className="text-xs text-blue-700 bg-blue-100 rounded-full px-3 py-1 mt-1">
          معلم الدورة
        </div>
      </div>

      {/* الطلاب */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        <div className="font-semibold text-gray-700 px-5 pt-4 pb-2 border-b border-gray-200">
          الطلاب ({students.length + (currentStudent ? 1 : 0)})
        </div>
        <ul className="space-y-2 px-4 py-4">
          {currentStudent && (
            <li className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
              <div className="relative">
                <img
                  src={currentStudent.profilePicture || "/default-profile.jpg"}
                  alt={currentStudent.firstName}
                  className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover"
                />
                <span
                  className="absolute bottom-0 left-0 w-3 h-3 rounded-full border-2 border-white bg-green-400"
                  title="متصل"
                ></span>
              </div>
              <div className="flex flex-col">
                <div className="font-medium text-blue-900 text-sm">
                  {currentStudent.firstName} {currentStudent.lastName}
                </div>
                <div className="text-xs text-blue-600">(أنت)</div>
              </div>
            </li>
          )}

          {students?.map((student) => {
            const isOnline = onlineUsers.includes(student._id);
            return (
              <li
                key={student._id}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition border ${
                  isOnline
                    ? "bg-white border-gray-200"
                    : "bg-gray-50 border-gray-100 opacity-60"
                }`}
              >
                <div className="relative">
                  <img
                    src={student.profilePicture || "/default-profile.jpg"}
                    alt={student.firstName}
                    className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                  />
                  <span
                    className={`absolute bottom-0 left-0 w-3 h-3 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-400" : "bg-gray-300"
                    }`}
                    title={isOnline ? "متصل" : "غير متصل"}
                  ></span>
                </div>
                <div className="text-gray-800 text-sm font-medium">
                  {student.firstName} {student.lastName}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default GroupChatSidebar;
