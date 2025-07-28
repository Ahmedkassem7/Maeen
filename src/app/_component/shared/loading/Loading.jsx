"use client";

const Loading = ({ text = "جاري التحميل..." }) => (
  <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-emerald-200/30 to-teal-300/30 rounded-full blur-xl animate-float-delayed"></div>
      <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-200/30 to-pink-300/30 rounded-full blur-xl animate-float-slow"></div>
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>
    </div>
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full border-4 border-blue-200/50 relative">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin-slow"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-20 h-20">
            <img src="/logo.PNG" alt="مُعِين" />
          </div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-gray-700 animate-pulse">
          {text}
        </p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-gray-200 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-progress"></div>
      </div>

      {/* Footer text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 font-medium">
          تجربة تعليمية رقمية متطورة
        </p>
      </div>
    </div>

    <style jsx>{`
      @keyframes spin-slow {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes pulse-slow {
        0%,
        100% {
          opacity: 0.8;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.05);
        }
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(180deg);
        }
      }

      @keyframes float-delayed {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-15px) rotate(-180deg);
        }
      }

      @keyframes float-slow {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-10px) rotate(90deg);
        }
      }

      @keyframes progress {
        0% {
          width: 0%;
        }
        50% {
          width: 70%;
        }
        100% {
          width: 100%;
        }
      }

      .animate-spin-slow {
        animation: spin-slow 3s linear infinite;
      }

      .animate-pulse-slow {
        animation: pulse-slow 2s ease-in-out infinite;
      }

      .animate-float {
        animation: float 6s ease-in-out infinite;
      }

      .animate-float-delayed {
        animation: float-delayed 8s ease-in-out infinite;
      }

      .animate-float-slow {
        animation: float-slow 10s ease-in-out infinite;
      }

      .animate-progress {
        animation: progress 2s ease-in-out infinite;
      }
    `}</style>
  </div>
);

export default Loading;
