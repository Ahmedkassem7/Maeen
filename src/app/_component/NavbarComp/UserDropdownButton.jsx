import { ChevronDown, User } from "lucide-react";

const UserDropdownButton = ({ user, isDropdownOpen, toggleDropdown }) => {
  return (
    <button
      onClick={toggleDropdown}
      className="flex cursor-pointer items-center space-x-4 space-x bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-blue-100 rounded-2xl p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl border border-slate-200/50"
    >
      <div className="w-12 h-12 bg-gradient-to-r from-islamic-blue to-blue-600 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
        ) : (
          <>
            <User className="w-6 h-6 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
          </>
        )}
      </div>
      <div className="flex flex-col items-start">
        <span className="text-slate-800 text-sm font-bold">
          {user.firstName} {user.lastName}
        </span>
        <div className="flex items-center space-x-2 space-x">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-slate-500 font-medium">
            {user.userType === "teacher" ? "معلم مُعتمد" : "طالب نشط"}
          </span>
        </div>
      </div>
      <ChevronDown
        className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
          isDropdownOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};

export default UserDropdownButton;
