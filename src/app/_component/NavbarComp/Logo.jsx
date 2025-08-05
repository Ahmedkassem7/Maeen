import { BookOpen } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="flex items-center">
      <Link
        className="flex items-center space-x-4 space-x hover:scale-105 transition-all duration-300 group"
        href="/"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] to-[#ffffff] rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative bg-gradient-to-r from-[#ffffff] to-[#ffffff] p-3 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300">
            <img src="/logo.PNG" alt="مُعِين" className="h-8 w-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-sm"></div>
        </div>
        <div className="flex flex-col mr-2">
          <span className="text-2xl font-black bg-gradient-to-r from-[#0b1b49] to-blue-900 bg-clip-text text-transparent">
            مُعِين
          </span>
          <span className="text-xs text-slate-500 font-medium -mt-1">
            تعلّم وعلِّم العلوم الإسلامية باحتراف
          </span>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
