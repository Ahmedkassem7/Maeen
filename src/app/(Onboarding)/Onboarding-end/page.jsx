"use client";
import { motion } from "framer-motion";

export default function OnboardingEnd() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl relative"
        style={{
          boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 8px 25px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
          className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full w-24 h-24 flex items-center justify-center mb-6 shadow-lg"
        >
          <span className="text-6xl">🎉</span>
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">تم استكمال بياناتك بنجاح!</h1>
        <p className="text-gray-600 text-center mb-4 text-lg">
          شكرًا لك على استكمال جميع الخطوات.<br />
          بياناتك الآن قيد المراجعة من الإدارة.
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center text-blue-700 text-sm mb-4">
          سيتم إشعارك فور الانتهاء من مراجعة بياناتك وتفعيل حسابك.<br />
          يمكنك متابعة بريدك الإلكتروني أو صفحة حسابك.
        </div>
        <a href="/waiting-approval" className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow hover:scale-105 transition-all duration-300">العودة للصفحة الرئيسية</a>
      </motion.div>
      <style jsx global>{`
        .onboarding-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
        }
        .onboarding-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"rgba(255,255,255,0.05)\"/><circle cx=\"10\" cy=\"60\" r=\"0.5\" fill=\"rgba(255,255,255,0.05)\"/><circle cx=\"90\" cy=\"40\" r=\"0.5\" fill=\"rgba(255,255,255,0.05)\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>');
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
