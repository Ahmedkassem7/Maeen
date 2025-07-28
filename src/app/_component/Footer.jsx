import React from "react";
import {
  BookOpen,
  Users,
  Award,
  Star,
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden"
      dir="rtl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center space-x-3 space-x">
              <div className="relative">
                {/* <BookOpen className="h-10 w-10 text-white" /> */}
                <div className="relative bg-gradient-to-r from-[#ffffff] to-[#ffffff] p-3 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300">
                  {/* <BookOpen className="h-8 w-8 text-white" /> */}
                  <img
                    src="/logo.PNG"
                    alt="مُعِين"
                    className="h-8 w-8 text-white"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">مُعِين</span>
                <span className="text-sm text-slate-300">
                  تعلم القرآن الكريم بإتقان
                </span>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">
              منصة تعليمية متخصصة في تعليم القرآن الكريم والعلوم الإسلامية
              بأسلوب عصري وتفاعلي. نهدف لربط المتعلمين بكتاب الله عز وجل.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4 space-x pt-2">
              <Link
                href="https://www.facebook.com/share/1ApzKywxyq/"
                className="group relative"
              >
                <div className="p-3 bg-slate-800 rounded-full group-hover:bg-blue-600 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                  <Facebook className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" />
                </div>
              </Link>
              <Link href="#" className="group relative">
                <div className="p-3 bg-slate-800 rounded-full group-hover:bg-sky-500 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                  <Twitter className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" />
                </div>
              </Link>
              <Link href="#" className="group relative">
                <div className="p-3 bg-slate-800 rounded-full group-hover:bg-pink-600 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                  <Instagram className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" />
                </div>
              </Link>
              <Link href="#" className="group relative">
                <div className="p-3 bg-slate-800 rounded-full group-hover:bg-red-600 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                  <Youtube className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" />
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white relative">
              روابط سريعة
              <div className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 mt-2"></div>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-white transition-all duration-300 flex items-center group text-sm"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full ml-3 group-hover:bg-green-500 transition-colors"></span>
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/episodes"
                  className="text-slate-300 hover:text-white transition-all duration-300 flex items-center group text-sm"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full ml-3 group-hover:bg-green-500 transition-colors"></span>
                  الحلقات
                </Link>
              </li>
              <li>
                <Link
                  href="/teacher/register"
                  className="text-slate-300 hover:text-white transition-all duration-300 flex items-center group text-sm"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full ml-3 group-hover:bg-green-500 transition-colors"></span>
                  انضم كمعلم
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 hover:text-white transition-all duration-300 flex items-center group text-sm"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full ml-3 group-hover:bg-green-500 transition-colors"></span>
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white relative">
              خدماتنا
              <div className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 mt-2"></div>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 space-x">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <BookOpen className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-slate-300 text-sm">
                  حفظ القرآن الكريم
                </span>
              </li>
              <li className="flex items-center space-x-3 space-x">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Users className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">تعليم التجويد</span>
              </li>
              <li className="flex items-center space-x-3 space-x">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-400" />
                </div>
                <span className="text-slate-300 text-sm">التفسير المبسط</span>
              </li>
              <li className="flex items-center space-x-3 space-x">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Award className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-slate-300 text-sm">القراءات العشر</span>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white relative">
              تواصل معنا
              <div className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 mt-2"></div>
            </h3>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 space-x group">
                <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">
                    البريد الإلكتروني
                  </span>
                  <span className="text-slate-300 text-sm">
                    info@maqraa.com
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 space-x group">
                <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-green-600/20 transition-colors">
                  <Phone className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">هاتف</span>
                  <span className="text-slate-300 text-sm">
                    +966 11 123 4567
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 space-x group">
                <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-purple-600/20 transition-colors">
                  <MapPin className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">العنوان</span>
                  <span className="text-slate-300 text-sm">مصر</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 space-x">
              <div className="text-slate-400 text-sm">
                © 2025 منصة مُعِين. جميع الحقوق محفوظة.
              </div>
              <div className="hidden md:flex items-center space-x-2 space-x">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-500">موقع آمن ومحمي</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 space-x">
              <Link
                href="/privacy"
                className="text-slate-400 hover:text-white text-sm transition-all duration-300 hover:underline underline-offset-4"
              >
                سياسة الخصوصية
              </Link>
              <Link
                href="/terms"
                className="text-slate-400 hover:text-white text-sm transition-all duration-300 hover:underline underline-offset-4"
              >
                شروط الاستخدام
              </Link>
              <Link
                href="/cookies"
                className="text-slate-400 hover:text-white text-sm transition-all duration-300 hover:underline underline-offset-4"
              >
                ملفات الارتباط
              </Link>
            </div>
          </div>

          {/* Decorative Line */}
          <div className="mt-8 flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
