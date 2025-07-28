"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/AuthStore';

export default function WaitingApproval() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    if (user?.userType !== 'teacher') {
      router.push('/');
      return;
    }

    if (user?.isVerified && user?.verificationStatus === 'approved') {
      router.push('/dashboard/teacher');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-md p-8 text-center space-y-6 animate-fadeIn border border-gray-100">
        
        {/* Icon */}
        <div className="w-16 h-16 mx-auto bg-sky-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-sky-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800">حسابك قيد المراجعة</h1>

        {/* Message */}
        <p className="text-gray-600 text-sm leading-relaxed">
          شكرًا لانضمامك إلينا! حسابك تحت المراجعة من قبل فريقنا. سيتم التواصل معك عبر البريد الإلكتروني بعد الانتهاء من التحقق.
        </p>

        {/* Animated loader */}
        <div className="animate-pulse flex justify-center">
          <div className="h-2 w-24 bg-sky-300/40 rounded-full"></div>
        </div>

        {/* Checklist */}
        <div className="bg-gray-50 p-4 rounded-xl text-right space-y-2 border border-gray-100">
          <p className="text-sm font-medium text-gray-500">نصائح للتسريع:</p>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>تأكد من اكتمال ملفك الشخصي</li>
            <li>مراجعة المستندات المرفقة</li>
            <li>الاطلاع على الشروط والسياسات</li>
          </ul>
        </div>

        {/* Button */}
        <button
          onClick={() => router.push('/')}
          className="w-full cursor-pointer py-2 px-4 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition duration-200 text-sm"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}
