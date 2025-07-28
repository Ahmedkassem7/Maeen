"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Award, BookOpen, Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import useAuthStore from "@/stores/AuthStore";
import { getAllHalakatByTeacher } from "./Api/halaka";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const fadeInDown = {
  initial: { opacity: 0, y: -60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Home() {
  const { login, isLoading, error, isAuthenticated, user } = useAuthStore();

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-right relative overflow-hidden"
      dir="rtl"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-l from-islamic-blue/5 via-transparent to-islamic-green/5">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 -z-10">
          {/* Geometric Islamic patterns */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-islamic-green/20 rotate-45 rounded-lg"></div>
            <div className="absolute top-40 right-32 w-24 h-24 border-2 border-islamic-blue/20 rotate-12 rounded-full"></div>
            <div className="absolute bottom-32 left-40 w-28 h-28 border-2 border-islamic-gold/20 -rotate-12 rounded-lg"></div>
          </div>

          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-islamic-green/20 to-islamic-green/10 rounded-full backdrop-blur-sm"
            {...floatingAnimation}
          />
          <motion.div
            className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-islamic-blue/20 to-islamic-blue/10 rounded-full backdrop-blur-sm"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 180, 360],
              transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              },
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-islamic-gold/20 to-islamic-gold/10 rounded-full backdrop-blur-sm"
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.1, 1],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              },
            }}
          />
          <motion.div
            className="absolute top-1/2 right-10 w-8 h-8 bg-gradient-to-br from-islamic-green/20 to-islamic-green/10 rounded-full backdrop-blur-sm"
            animate={{
              y: [0, -12, 0],
              x: [0, 5, 0],
              transition: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              },
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <motion.div
            className="text-center relative z-10"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div
              className="inline-block mb-6 px-6 py-2 bg-white/80 backdrop-blur-md rounded-full border border-islamic-green/20 shadow-lg"
              variants={fadeInDown}
            >
              <span className="text-islamic-green font-semibold text-sm">
                ✨ منصة تعليمية رائدة في تعليم العلوم الاسلاميه
              </span>
            </motion.div>

            <motion.h1
              className="text-[48px] md:text-[72px] font-bold text-transparent bg-clip-text bg-gradient-to-l from-islamic-blue via-slate-800 to-islamic-green mb-8 leading-tight"
              variants={fadeInUp}
            >
              مرحباً بكم في منصة{" "}
              <motion.span
                className="relative inline-block"
                animate={{
                  scale: [1, 1.05, 1],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <span className="text-islamic-green relative z-10">مُعِين</span>
                <div className="absolute inset-0 bg-islamic-green/10 rounded-lg blur-xl -z-10"></div>
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
              variants={fadeInUp}
            >
              منصة تعليمية متخصصة في تعليم القرآن الكريم والعلوم الإسلامية
              <br />
              <span className="text-lg text-slate-500">
                "خيركم من تعلم القرآن وعلمه"{" "}
              </span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={fadeInUp}
            >
              <Link href={`${isAuthenticated ? "/freelance" : "/login"}`}>
                <motion.button
                  className="group relative inline-flex items-center justify-center gap-3 whitespace-nowrap font-semibold ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white h-14 rounded-xl text-lg px-10 py-4 cursor-pointer bg-gradient-to-l from-islamic-blue to-blue-700 hover:from-blue-700 hover:to-islamic-blue shadow-xl hover:shadow-2xl transform overflow-hidden"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(3, 27, 73, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative z-10">ابدأ رحلتك التعليمية</span>
                  <motion.div
                    className="relative z-10"
                    animate={{
                      x: [0, 5, 0],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </motion.div>
                </motion.button>
              </Link>

              <Link href="/episodes">
                <motion.button
                  className="group inline-flex items-center justify-center gap-3 whitespace-nowrap font-semibold ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-islamic-green bg-white/80 backdrop-blur-md hover:bg-islamic-green hover:border-islamic-green hover:text-white h-14 rounded-xl text-lg px-10 py-4 cursor-pointer transform shadow-lg hover:shadow-xl text-islamic-green"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <BookOpen className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  استكشف الدورات
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="mt-16 flex flex-wrap justify-center items-center gap-8 text-slate-500"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-islamic-green" />
                <span className="text-sm">أكثر من 100 طالب</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-islamic-gold" />
                <span className="text-sm">شهادات معتمدة</span>
              </div> */}
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-sm">تقييم 4.9/5</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      {/* Features Section - Enhanced with Services */}
      <motion.div
        className="py-20 bg-gradient-to-b from-slate-50 to-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <motion.div
              className="inline-block mb-4 px-4 py-2 bg-islamic-blue/10 rounded-full"
              variants={fadeInUp}
            >
              <span className="text-islamic-blue font-semibold text-sm">
                خدماتنا المتميزة
              </span>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
              variants={fadeInUp}
            >
              استكشف{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-islamic-blue to-blue-600">
                خدماتنا
              </span>{" "}
              التعليمية
            </motion.h2>
            <motion.p
              className="text-xl text-slate-600 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              نقدم مجموعة شاملة من الخدمات التعليمية المتخصصة في القرآن الكريم
              والعلوم الإسلامية
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
            variants={staggerContainer}
          >
            <motion.div
              className="group text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100"
              variants={scaleIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-islamic-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                تعليم القرآن
              </h3>
              <p className="text-slate-600 text-sm">
                حفظ وتلاوة مع أحكام التجويد
              </p>
            </motion.div>

            <motion.div
              className="group text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100"
              variants={scaleIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-islamic-green to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                حلقات جماعية
              </h3>
              <p className="text-slate-600 text-sm">تعلم مع مجموعات متفاعلة</p>
            </motion.div>

            <motion.div
              className="group text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100"
              variants={scaleIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                متابعة فردية
              </h3>
              <p className="text-slate-600 text-sm">إرشاد شخصي لكل طالب</p>
            </motion.div>
          </motion.div>

          {/* Additional feature highlight */}
          {/* <motion.div
            className="bg-gradient-to-r from-islamic-blue/10 via-blue-50 to-islamic-green/10 rounded-3xl p-8 md:p-12"
            variants={fadeInUp}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">
                  تكنولوجيا متقدمة في خدمة التعليم
                </h3>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  نستخدم أحدث التقنيات التعليمية لضمان تجربة تعلم فعالة ومتميزة،
                  مع منصة تفاعلية سهلة الاستخدام
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-islamic-green rounded-full"></div>
                    <span className="text-slate-700">فصول افتراضية مباشرة</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-islamic-blue rounded-full"></div>
                    <span className="text-slate-700">تسجيلات عالية الجودة</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-700">نظام تتبع التقدم</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
                  <div className="aspect-video bg-gradient-to-br from-islamic-blue/20 to-islamic-green/20 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="h-16 w-16 text-islamic-blue mx-auto mb-4" />
                      <div className="text-lg font-semibold text-slate-700">
                        واجهة تعليمية تفاعلية
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div> */}
        </div>
      </motion.div>

      {/* Why Choose Section */}
      <motion.div
        className="py-20 bg-white relative"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <motion.div
              className="inline-block mb-4 px-4 py-2 bg-islamic-green/10 rounded-full"
              variants={fadeInUp}
            >
              <span className="text-islamic-green font-semibold text-sm">
                لماذا تختارنا
              </span>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
              variants={fadeInUp}
            >
              لماذا تختار منصة{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-islamic-green to-emerald-600">
                مُعِين
              </span>
              ؟
            </motion.h2>
            <motion.p
              className="text-xl text-slate-600 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              نوفر تعليماً متميزاً يجمع بين الأصالة والحداثة مع أحدث طرق التعليم
              التفاعلي
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            <motion.div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100"
              variants={scaleIn}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-islamic-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-islamic-blue to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <BookOpen className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  تعليم متخصص
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  نخبة من المعلمين المتخصصين في تعليم القرآن الكريم والعلوم
                  الإسلامية مع خبرة تزيد عن 10 سنوات
                </p>
                <div className="mt-6 flex items-center text-islamic-blue font-semibold">
                  <span className="text-sm">تعرف على المزيد</span>
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100"
              variants={scaleIn}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-islamic-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-islamic-green to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: -5 }}
                >
                  <Users className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  بيئة تفاعلية
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  تفاعل مباشر مع المعلمين والطلاب في بيئة تعليمية محفزة ومشجعة
                  ومتخصصة مع أدوات تفاعلية حديثة
                </p>
                <div className="mt-6 flex items-center text-islamic-green font-semibold">
                  <span className="text-sm">اكتشف البيئة التفاعلية</span>
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100"
              variants={scaleIn}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-islamic-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-islamic-gold to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <Award className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  مرونة في التعلم{" "}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  إمكانية الوصول إلى المحتوى التعليمي في أي وقت ومن أي مكان، مع
                  خيارات مرنة للدراسة تناسب جميع الجداول الزمنية
                </p>
                <div className="mt-6 flex items-center text-islamic-gold font-semibold">
                  <span className="text-sm">استكشف المرونة في التعلم</span>
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      {/* Statistics Section */}
      <motion.div
        className="py-20 bg-gradient-to-br from-slate-900 via-islamic-blue to-blue-900 text-white relative overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        {/* Enhanced animated background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-20"></div>
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.1 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 border border-white/10 rounded-lg rotate-12"></div>
            <div className="absolute bottom-20 left-1/4 w-20 h-20 border border-white/10 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 border border-white/10 rounded-lg -rotate-12"></div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <motion.div
              className="inline-block mb-4 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
              variants={fadeInUp}
            >
              <span className="text-white font-semibold text-sm">
                إنجازاتنا بالأرقام
              </span>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4"
              variants={fadeInUp}
            >
              نفخر بما حققناه معاً
            </motion.h2>
            <motion.p
              className="text-xl text-blue-100 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              أرقام تعكس التزامنا بتقديم أفضل تعليم للقرآن الكريم
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            <motion.div
              className="text-center group"
              variants={scaleIn}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-2">
                  100+
                </div>
                <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-xl group-hover:bg-blue-400/30 transition-colors duration-300"></div>
              </motion.div>
              <motion.div
                className="text-blue-200 font-medium"
                variants={fadeInUp}
              >
                طالب نشط
              </motion.div>
              <motion.div
                className="text-blue-300 text-sm mt-1"
                variants={fadeInUp}
              >
                من جميع أنحاء العالم
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center group"
              variants={scaleIn}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-300 mb-2">
                  20+
                </div>
                <div className="absolute inset-0 bg-emerald-400/20 rounded-lg blur-xl group-hover:bg-emerald-400/30 transition-colors duration-300"></div>
              </motion.div>
              <motion.div
                className="text-blue-200 font-medium"
                variants={fadeInUp}
              >
                معلم خبير
              </motion.div>
              <motion.div
                className="text-blue-300 text-sm mt-1"
                variants={fadeInUp}
              >
                متخصصون ومعتمدون
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center group"
              variants={scaleIn}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.3,
                }}
              >
                <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 mb-2">
                  10+
                </div>
                <div className="absolute inset-0 bg-yellow-400/20 rounded-lg blur-xl group-hover:bg-yellow-400/30 transition-colors duration-300"></div>
              </motion.div>
              <motion.div
                className="text-blue-200 font-medium"
                variants={fadeInUp}
              >
                حلقة تعليمية
              </motion.div>
              <motion.div
                className="text-blue-300 text-sm mt-1"
                variants={fadeInUp}
              >
                متنوعة ومتخصصة
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center group"
              variants={scaleIn}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.4,
                }}
              >
                <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-pink-300 mb-2">
                  1
                </div>
                <div className="absolute inset-0 bg-red-400/20 rounded-lg blur-xl group-hover:bg-red-400/30 transition-colors duration-300"></div>
              </motion.div>
              <motion.div
                className="text-blue-200 font-medium"
                variants={fadeInUp}
              >
                سنوات خبرة
              </motion.div>
              <motion.div
                className="text-blue-300 text-sm mt-1"
                variants={fadeInUp}
              >
                في التعليم الرقمي
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Additional achievement highlights */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
          >
            <motion.div
              className="text-center p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
              variants={fadeInUp}
            >
              <div className="text-2xl font-bold text-blue-300 mb-2">98%</div>
              <div className="text-blue-200">معدل رضا الطلاب</div>
            </motion.div>
            <motion.div
              className="text-center p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
              variants={fadeInUp}
            >
              <div className="text-2xl font-bold text-emerald-300 mb-2">
                100+
              </div>
              <div className="text-blue-200">ساعة تعليمية</div>
            </motion.div>
            <motion.div
              className="text-center p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
              variants={fadeInUp}
            >
              <div className="text-2xl font-bold text-yellow-300 mb-2">1+</div>
              <div className="text-blue-200">دولة حول العالم</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="py-20 bg-gradient-to-b from-white to-slate-50"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <motion.div
              className="inline-block mb-4 px-4 py-2 bg-islamic-green/10 rounded-full"
              variants={fadeInUp}
            >
              <span className="text-islamic-green font-semibold text-sm">
                شهادات طلابنا
              </span>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
              variants={fadeInUp}
            >
              آراء طلابنا المتميزين
            </motion.h2>
            <motion.p
              className="text-xl text-slate-600 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              تعرف على تجارب طلابنا الناجحة مع منصة مُعِين وكيف غيرت حياتهم
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            <motion.div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100"
              variants={fadeInLeft}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-islamic-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <motion.div
                  className="flex items-center mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`star-1-${i}`}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <Star className="text-yellow-400 fill-current h-5 w-5" />
                    </motion.div>
                  ))}
                </motion.div>
                <blockquote className="text-slate-700 text-lg leading-relaxed mb-6 italic">
                  "تجربة رائعة في تعلم القرآن الكريم. المعلمون متميزون والطريقة
                  سهلة ومفهومة. لقد تحسن حفظي وتجويدي بشكل ملحوظ."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-islamic-blue to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    أ
                  </div>
                  <div className="mr-4">
                    <div className="font-semibold text-slate-800">
                      أحمد محمد
                    </div>
                    <div className="text-sm text-slate-500">
                      طالب في برنامج التجويد
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100"
              variants={fadeInUp}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-islamic-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <motion.div
                  className="flex items-center mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`star-2-${i}`}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <Star className="text-yellow-400 fill-current h-5 w-5" />
                    </motion.div>
                  ))}
                </motion.div>
                <blockquote className="text-slate-700 text-lg leading-relaxed mb-6 italic">
                  "المنصة ساعدتني كثيراً في إتقان التجويد. أنصح بها كل من يريد
                  تعلم القرآن بطريقة علمية وممتعة."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-islamic-green to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    ف
                  </div>
                  <div className="mr-4">
                    <div className="font-semibold text-slate-800">
                      فاطمة علي
                    </div>
                    <div className="text-sm text-slate-500">
                      طالبة في برنامج الحفظ
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100"
              variants={fadeInRight}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-islamic-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <motion.div
                  className="flex items-center mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`star-3-${i}`}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <Star className="text-yellow-400 fill-current h-5 w-5" />
                    </motion.div>
                  ))}
                </motion.div>
                <blockquote className="text-slate-700 text-lg leading-relaxed mb-6 italic">
                  "بيئة تعليمية ممتازة ومعلمون على أعلى مستوى. أطفالي يحبون
                  الدروس ويتطلعون إليها كل يوم."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-islamic-gold to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    ع
                  </div>
                  <div className="mr-4">
                    <div className="font-semibold text-slate-800">
                      عمر السعدي
                    </div>
                    <div className="text-sm text-slate-500">ولي أمر</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="py-24 bg-gradient-to-br from-islamic-blue via-blue-800 to-slate-900 text-white relative overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-10 right-10 w-40 h-40 bg-white/5 rounded-full backdrop-blur-sm"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
              transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full backdrop-blur-sm"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              },
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full backdrop-blur-sm"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.05, 0.08, 0.05],
              transition: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              },
            }}
          />
          <motion.div
            className="absolute bottom-20 right-1/3 w-20 h-20 bg-white/5 rounded-full backdrop-blur-sm"
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              transition: {
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              },
            }}
          />

          {/* Geometric shapes */}
          <div className="absolute top-20 left-20 w-16 h-16 border-2 border-white/10 rounded-lg rotate-12"></div>
          <div className="absolute bottom-32 right-24 w-12 h-12 border-2 border-white/10 rounded-full"></div>
          <div className="absolute top-1/3 right-16 w-8 h-8 border-2 border-white/10 rounded-lg -rotate-12"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            className="inline-block mb-6 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
            variants={fadeInUp}
          >
            <span className="text-blue-200 font-semibold text-sm">
              🎓 انضم إلى مجتمعنا التعليمي
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            variants={fadeInUp}
          >
            ابدأ رحلتك التعليمية{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
              اليوم
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            انضم إلى آلاف الطلاب الذين يتعلمون القرآن الكريم على منصتنا
            <br />
            <span className="text-lg text-blue-200">
              واحصل على تجربة تعليمية فريدة ومتميزة
            </span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            variants={fadeInUp}
          >
            <Link href="/register">
              <motion.button
                className="group relative inline-flex items-center justify-center gap-3 whitespace-nowrap font-bold ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-16 rounded-2xl text-xl px-12 py-4 cursor-pointer bg-white text-islamic-blue hover:bg-blue-50 shadow-2xl hover:shadow-3xl transform overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(255, 255, 255, 0.4)",
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Users className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">سجل الآن مجاناً</span>
                <motion.div
                  className="relative z-10"
                  animate={{
                    x: [0, 5, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <ArrowLeft className="h-6 w-6" />
                </motion.div>
              </motion.button>
            </Link>

            <Link href="/episodes">
              <motion.button
                className="group inline-flex items-center justify-center gap-3 whitespace-nowrap font-semibold ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-white/30 bg-white/10 backdrop-blur-md hover:bg-white hover:text-[red] h-16 rounded-2xl text-xl px-12 py-4 cursor-pointer transform"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <BookOpen className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                تصفح الحلقات{" "}
              </motion.button>
            </Link>
          </motion.div>

          {/* Special offers or highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            variants={staggerContainer}
          >
            <motion.div
              className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <Award className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
              <div className="text-lg font-semibold mb-2">تجربة مجانية</div>
              <div className="text-blue-200 text-sm">أسبوع كامل مجاناً</div>
            </motion.div>

            <motion.div
              className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <Users className="h-8 w-8 text-green-300 mx-auto mb-3" />
              <div className="text-lg font-semibold mb-2">دعم 24/7</div>
              <div className="text-blue-200 text-sm">فريق دعم متخصص</div>
            </motion.div>

            <motion.div
              className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <BookOpen className="h-8 w-8 text-blue-300 mx-auto mb-3" />
              <div className="text-lg font-semibold mb-2">محتوى شامل</div>
              <div className="text-blue-200 text-sm">مناهج متكاملة</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      {/* ------- */}
    </div>
  );
}
