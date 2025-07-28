"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import useAuthStore from '../../../stores/AuthStore';
import useAuthStore from '@/stores/AuthStore';

export default function WaitingApproval() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // التحقق من حالة المستخدم
  useEffect(() => {
    // إذا لم يكن مسجل الدخول، توجيه للصفحة الرئيسية
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // إذا كان طالب، توجيه للصفحة الرئيسية
    if (user?.userType !== 'teacher') {
      router.push('/');
      return;
    }

    // إذا كان معلم مفعل، توجيه للوحة التحكم
    if (user?.isVerified && user?.verificationStatus === 'approved') {
      router.push('/dashboard/teacher');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-primary/10 to-islamic-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-islamic-primary/10 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-islamic-primary"
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
        
        <h1 className="text-2xl font-bold text-gray-800">في انتظار الموافقة</h1>
        
        <p className="text-gray-600">
          حسابك قيد المراجعة من قبل إدارة المنصة. 
          سيتم إخطارك عبر البريد الإلكتروني فور الموافقة على حسابك.
        </p>
        
        <div className="animate-pulse flex justify-center">
          <div className="h-2 w-24 bg-islamic-primary/30 rounded"></div>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            يمكنك الاطلاع على:
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• التأكد من اكتمال ملفك الشخصي</li>
            <li>• مراجعة الوثائق المطلوبة</li>
            <li>• الاطلاع على شروط وأحكام المنصة</li>
          </ul>
        </div>
        
        <button
          onClick={() => router.push('/')}
          className="w-full py-2 px-4 bg-islamic-primary text-white rounded-lg hover:bg-islamic-primary/90 transition duration-200"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}
