"use client";
import React, { useRef, useState } from "react";
import { Button } from "../../_component/ui/Button";
import { Badge } from "../../_component/ui/Badge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const DOCS = [
  {
    key: "national_id_front",
    label: "وجه البطاقة الشخصية",
    accept: "image/*",
    desc: "يرجى رفع صورة واضحة لوجه البطاقة الشخصية (JPG, PNG, ...)",
    icon: "🪪",
  },
  {
    key: "national_id_back",
    label: "ظهر البطاقة الشخصية",
    accept: "image/*",
    desc: "يرجى رفع صورة واضحة لظهر البطاقة الشخصية (JPG, PNG, ...)",
    icon: "🪪",
  },
  {
    key: "certificates",
    label: "شهاداتك التعليمية (PDF)",
    accept: ".pdf",
    desc: "ارفع ملف PDF يحتوي على شهاداتك التعليمية أو الدورات التي حصلت عليها.",
    icon: "📄",
  },
];

const initialState = {
  national_id_front: null,
  national_id_back: null,
  certificates: null,
};

export default function UploadDocumentsStep() {
  const [files, setFiles] = useState(initialState);
  const [previews, setPreviews] = useState({});
  const [uploading, setUploading] = useState({});
  const [uploaded, setUploaded] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef({});
  const router = useRouter();

  // Simulate token (replace with real AuthStore)
  const authStorage = JSON.parse(localStorage.getItem("auth-storage"));
  const token = authStorage?.state?.token;

  // Handle file select
  const handleFileChange = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setError("");
    setSuccess("");
    // Preview for images
    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => ({ ...prev, [key]: e.target.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreviews((prev) => ({ ...prev, [key]: null }));
    }
  };

  // Upload file
  const handleUpload = async (key) => {
    setUploading((prev) => ({ ...prev, [key]: true }));
    setError("");
    setSuccess("");
    const file = files[key];
    if (!file) return;
    const formData = new FormData();
    formData.append("document", file);
    formData.append("docType", key);
    try {
      const res = await fetch("https://backend-ui4w.onrender.com/api/v1/onboarding/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        setUploaded((prev) => ({ ...prev, [key]: data.data }));
        setSuccess("تم رفع الملف بنجاح!");
        // router.push("/Onboarding-end");
      } else {
        setError(data.message || "فشل رفع الملف");
      }
    } catch (e) {
      setError("فشل الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Delete file
  const handleDelete = async (key) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const doc = uploaded[key];
      if (!doc) return;
      const res = await fetch(`/api/onboarding/documents/${doc._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.status === "success") {
        setUploaded((prev) => ({ ...prev, [key]: null }));
        setFiles((prev) => ({ ...prev, [key]: null }));
        setPreviews((prev) => ({ ...prev, [key]: null }));
        setSuccess("تم حذف الملف بنجاح");
      } else {
        setError(data.message || "فشل حذف الملف");
      }
    } catch (e) {
      setError("فشل الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  // Submit all
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!uploaded.national_id_front || !uploaded.national_id_back || !uploaded.certificates) {
      setError("يرجى رفع جميع الملفات المطلوبة أولاً");
      return;
    }
    setSuccess("تم رفع جميع الملفات بنجاح! سيتم مراجعتها من الإدارة.");
    // TODO: Redirect or show next step
    router.push("/Onboarding-end");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl bg-white rounded-2xl p-8 relative"
        style={{
          boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 8px 25px rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 progress-steps">
          <div className="flex items-center">
            {/* Step 1 - Done */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg relative">
                <span className="text-2xl">✓</span>
              </div>
              <div className="ml-3 mr-3">
                <div className="text-sm font-semibold text-gray-800">استكمال البيانات</div>
                <div className="text-xs text-gray-500">المعلومات الشخصية</div>
              </div>
            </div>
            {/* Connecting Line */}
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-4 relative connecting-line">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
            {/* Step 2 - Active */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg relative">
                2
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
              </div>
              <div className="mr-3">
                <div className="text-sm font-semibold text-gray-800">رفع الملفات</div>
                <div className="text-xs text-gray-500">الوثائق المطلوبة</div>
              </div>
            </div>
          </div>
        </div>
        {/* Title & Instructions */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">رفع الوثائق المطلوبة</h1>
          <p className="text-gray-600 text-sm">يرجى رفع الملفات التالية بدقة ووضوح. جميع الملفات ستظل سرية وتستخدم فقط للتحقق من هويتك.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {DOCS.map((doc) => (
              <div key={doc.key} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100 flex flex-col md:flex-row items-center gap-4 shadow-sm">
                <div className="text-4xl md:text-5xl">{doc.icon}</div>
                <div className="flex-1 w-full">
                  <div className="font-semibold text-gray-700 mb-1">{doc.label}</div>
                  <div className="text-xs text-gray-500 mb-2">{doc.desc}</div>
                  {/* Preview */}
                  {uploaded[doc.key] ? (
                    <div className="flex items-center gap-3 mt-2">
                      {doc.accept === "image/*" && uploaded[doc.key].fileUrl && (
                        <img src={uploaded[doc.key].fileUrl} alt={doc.label} className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow" />
                      )}
                      {doc.accept === ".pdf" && uploaded[doc.key].fileUrl && (
                        <a href={uploaded[doc.key].fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium flex items-center gap-1">
                          <span className="text-lg">📄</span> عرض الشهادة
                        </a>
                      )}
                      <Button type="button" variant="destructive" className="px-3 py-1 text-xs" onClick={() => handleDelete(doc.key)} disabled={loading}>
                        حذف
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        name="docmuent"
                        type="file"
                        accept={doc.accept}
                        style={{ display: "none" }}
                        ref={el => inputRefs.current[doc.key] = el}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) handleFileChange(doc.key, file);
                        }}
                        disabled={uploading[doc.key]}
                      />
                      <Button
                        type="button"
                        className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow hover:scale-105 transition"
                        onClick={() => inputRefs.current[doc.key]?.click()}
                        disabled={uploading[doc.key]}
                      >
                        اختر ملف
                      </Button>
                      {files[doc.key] && (
                        <>
                          <span className="text-xs text-gray-700">{files[doc.key].name}</span>
                          <Button
                            type="button"
                            className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded"
                            onClick={() => {
                              setFiles(prev => ({ ...prev, [doc.key]: null }));
                              setPreviews(prev => ({ ...prev, [doc.key]: null }));
                            }}
                          >
                            إلغاء
                          </Button>
                          <Button
                            type="button"
                            className="px-3 py-1 text-xs bg-gradient-to-r from-green-500 to-teal-500 text-white rounded"
                            onClick={() => handleUpload(doc.key)}
                            disabled={uploading[doc.key]}
                          >
                            {uploading[doc.key] ? "... جاري الرفع" : "رفع"}
                          </Button>
                        </>
                      )}
                      {/* Preview for images before upload */}
                      {previews[doc.key] && doc.accept === "image/*" && (
                        <img src={previews[doc.key]} alt="preview" className="w-12 h-12 object-cover rounded border border-gray-200" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center animate-pulse flex items-center justify-center gap-2">
              <span className="text-red-500">⚠️</span>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-center animate-fade-in flex items-center justify-center gap-2">
              <span className="text-green-500">✅</span>
              {success}
            </div>
          )}
          <Button
            type="submit"
            className="w-full py-4 text-lg font-bold mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            إنهاء
          </Button>
        </form>
        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span className="text-blue-500">🔒</span>
              <span>جميع الملفات سرية وتستخدم فقط للتحقق من هويتك</span>
            </div>
          </div>
        </div>
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        .animate-fade-in {
          animation: fadeIn 0.7s ease-in-out;
        }
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @media (max-width: 768px) {
          .progress-steps {
            flex-direction: column;
            gap: 1rem;
          }
          .progress-steps .connecting-line {
            width: 1px;
            height: 2rem;
            margin: 0.5rem 0;
          }
        }
      `}</style>
    </div>
  );
} 