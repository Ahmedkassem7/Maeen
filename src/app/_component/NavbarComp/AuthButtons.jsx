import Link from "next/link";
import { Button } from "../ui/Button";

const AuthButtons = () => {
  return (
    <div className="flex items-center space-x-3 space-x">
      <Link href="/login">
        <Button className="text-islamic-blue border-2 border-islamic-blue bg-transparent hover:bg-islamic-blue hover:text-white transition-all duration-300 px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transform">
          دخول
        </Button>
      </Link>
      <Link href="/register">
        <Button className="bg-gradient-to-r from-islamic-blue to-blue-600 text-white hover:from-blue-700 hover:to-blue-700 hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transform">
          إنشاء حساب
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
