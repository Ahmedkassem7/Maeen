"use client";
import React, { useState } from "react";
import { Input } from "../../_component/ui/Input";
import { Textarea } from "../../_component/ui/Textarea";
import { Button } from "../../_component/ui/Button";
import { Badge } from "../../_component/ui/Badge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// --- تم تحديث قائمة التخصصات لتتوافق مع الصورة والـ API ---
const SPECIALIZATIONS = [
  { value: "quran_memorization", label: "تحفيظ القرآن الكريم" },
  { value: "tajweed", label: "التجويد" },
  { value: "arabic", label: "اللغة العربية" },
  { value: "islamic_studies", label: "الدراسات الإسلامية" },
];

// --- قائمة المهارات المقترحة ---
const PREDEFINED_SKILLS = [
  "إتقان أحكام التجويد",
  "تعليم القراءة الصحيحة",
  "شرح مبسط للقواعد",
  "الصبر في التعليم",
  "التواصل مع الأطفال",
  "استخدام الوسائل التعليمية",
  "تحفيز الطلاب",
  "علم القراءات",
  "تفسير القرآن",
  "فقه العبادات",
  "شرح متن الجزرية",
  "تعليم القاعدة النورانية",
];

const initialState = {
  specialization: "",
  bio: "",
  skills: "", // ستبقى نصًا واحدًا
  experience: "",
  sessionPrice: "",
  id_number: "",
};

const MAX_BIO = 500;
const MAX_SKILLS = 200; // الحد الأقصى لطول النص النهائي للمهارات

export default function TeacherOnboardingPage() {
  const [form, setForm] = useState(initialState);
  const [skillInput, setSkillInput] = useState(""); // حالة لإدخال المهارة الحالية
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- دوال خاصة بإدارة المهارات ---

  // تحويل نص المهارات إلى مصفوفة لعرضها
  const selectedSkills = form.skills
    ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const handleAddSkill = (skillToAdd) => {
    const newSkill = skillToAdd.trim();
    // تأكد من أن المهارة غير مضافة مسبقًا
    if (newSkill && !selectedSkills.includes(newSkill)) {
      const newSkillsString = [...selectedSkills, newSkill].join(", ");
      setForm((prev) => ({ ...prev, skills: newSkillsString }));
    }
    setSkillInput(""); // تفريغ حقل الإدخال بعد الإضافة
  };

  const handleRemoveSkill = (skillToRemove) => {
    const newSkillsArray = selectedSkills.filter(
      (skill) => skill !== skillToRemove
    );
    const newSkillsString = newSkillsArray.join(", ");
    setForm((prev) => ({ ...prev, skills: newSkillsString }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // منع الفورم من الإرسال
      handleAddSkill(skillInput);
    }
  };
  
  // فلترة المهارات المقترحة بناءً على ما يكتبه المستخدم
  const filteredSuggestions = PREDEFINED_SKILLS.filter(
    (skill) =>
      skill.toLowerCase().includes(skillInput.toLowerCase()) &&
      !selectedSkills.includes(skill) &&
      skillInput
  );

  const validate = () => {
    if (!form.specialization) return "اختر التخصص";
    if (!form.bio || form.bio.length > MAX_BIO)
      return "السيرة الذاتية مطلوبة (بحد أقصى 500 حرف)";
    if (!form.skills || form.skills.length > MAX_SKILLS)
      return `المهارات مطلوبة (بحد أقصى ${MAX_SKILLS} حرف للنص النهائي)`;
    if (
      !form.experience ||
      isNaN(form.experience) ||
      form.experience < 0 ||
      form.experience > 50
    )
      return "عدد سنوات الخبرة يجب أن يكون بين 0 و 50";
    if (!form.sessionPrice || isNaN(form.sessionPrice) || form.sessionPrice < 1)
      return "سعر الجلسة يجب أن يكون رقم أكبر من أو يساوي 1";
    if (!form.id_number || form.id_number.length !== 14)
      return "رقم البطاقة يجب أن يكون 14 رقم";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      const authStorage = JSON.parse(localStorage.getItem("auth-storage"));
      const token = authStorage?.state?.token;
      const res = await fetch(
        "https://backend-ui4w.onrender.com/api/v1/onboarding/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            experience: Number(form.experience),
            sessionPrice: Number(form.sessionPrice),
          }),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        setSuccess("تم حفظ البيانات بنجاح! سيتم توجيهك للخطوة التالية.");
        setTimeout(() => router.push("/Onboarding-document"), 2000);
      } else {
        setError(data.message || "حدث خطأ غير متوقع");
      }
    } catch (e) {
      setError("فشل الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
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
        {/* ... (الجزء الخاص بخطوات التقدم لم يتم تغييره) ... */}
        <div
          className="flex items-center justify-center mb-8 progress-steps"
          dir="rtl"
        >
          <div className="flex items-center">
            {/* Step 1 - Active */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg relative">
                1
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
              </div>
              <div className="ml-3 mr-3">
                <div className="text-sm font-semibold text-gray-800">
                  استكمال البيانات
                </div>
                <div className="text-xs text-gray-500">المعلومات الشخصية</div>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-4 relative connecting-line">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>

            {/* Step 2 - Inactive */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg border-2 border-gray-300">
                2
              </div>
              <div className="mr-3">
                <div className="text-sm font-semibold text-gray-400">
                  رفع الملفات
                </div>
                <div className="text-xs text-gray-400">الوثائق المطلوبة</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 relative">
            استكمال بيانات المعلم
          </h1>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            مرحبًا بك يا معلمنا الكريم! 👨‍🏫
          </h2>
          <p className="text-gray-600 leading-relaxed">
            من فضلك أكمل بياناتك المهنية حتى نتمكن من تفعيل حسابك
            <br />
            <span className="text-blue-600 font-medium">
              جميع البيانات سرية ومؤمنة
            </span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
           <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
             <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
               <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
               التخصص <span className="text-red-500">*</span>
             </label>
             <select
               name="specialization"
               value={form.specialization}
               onChange={handleChange}
               className="w-full cursor-pointer border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 bg-white"
               required
             >
               <option value="" disabled>
                 اختر التخصص المناسب لك...
               </option>
               {SPECIALIZATIONS.map((s) => (
                 <option key={s.value} value={s.value}>
                   {s.label}
                 </option>
               ))}
             </select>
           </div>
           <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-100">
             <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full"></span>
               السيرة الذاتية <span className="text-red-500">*</span>
             </label>
             <Textarea
               name="bio"
               value={form.bio}
               onChange={handleChange}
               maxLength={MAX_BIO}
               placeholder="اكتب عن خبرتك في التدريس، مؤهلاتك، وأسلوبك في التعليم..."
               className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all duration-200 min-h-[100px] bg-white resize-none"
               required
             />
             <div className="text-xs text-gray-500 text-end mt-1 font-medium">
               {form.bio.length}/{MAX_BIO}
             </div>
           </div>

          {/* --- حقل المهارات الجديد --- */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
            <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              المهارات <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="flex flex-wrap gap-2 items-center p-2 border-2 border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-purple-300 focus-within:border-purple-400 transition-all duration-200">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-2 bg-purple-100 text-purple-800 py-1 px-3 rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-purple-600 hover:text-purple-900 font-bold text-lg"
                    >
                      &times;
                    </button>
                  </Badge>
                ))}
                <input
                  name="skills_input"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder={
                    selectedSkills.length === 0
                      ? "أضف مهارة واختر أو اضغط Enter..."
                      : "أضف المزيد..."
                  }
                  className="flex-grow bg-transparent outline-none p-1 text-sm"
                />
              </div>
              {filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {filteredSuggestions.map((suggestion) => (
                    <li
                      key={suggestion}
                      onClick={() => handleAddSkill(suggestion)}
                      className="px-4 py-2 cursor-pointer hover:bg-purple-50 text-gray-700"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="text-xs text-gray-500 text-end mt-1 font-medium">
              اضغط <kbd className="bg-gray-200 p-1 rounded">Enter</kbd> لإضافة مهارة جديدة.
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-100">
               <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
                 <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                 سنوات الخبرة <span className="text-red-500">*</span>
               </label>
               <Input
                 name="experience"
                 type="number"
                 min="0"
                 max="50"
                 value={form.experience}
                 onChange={handleChange}
                 placeholder="مثال: 5 سنوات"
                 className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all duration-200 bg-white"
                 required
               />
             </div>
             <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-100">
               <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
                 <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                 سعر الجلسة (جنيه) <span className="text-red-500">*</span>
               </label>
               <Input
                 name="sessionPrice"
                 type="number"
                 min="1"
                 value={form.sessionPrice}
                 onChange={handleChange}
                 placeholder="مثال: 50 جنيه"
                 className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition-all duration-200 bg-white"
                 required
               />
             </div>
           </div>
           <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
             <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
               <span className="w-2 h-2 bg-red-500 rounded-full"></span>
               رقم البطاقة الشخصية <span className="text-red-500">*</span>
             </label>
             <Input
               name="id_number"
               value={form.id_number}
               onChange={handleChange}
               maxLength={14}
               minLength={14}
               placeholder="مثال: 2980XXXXXXXXXX"
               className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all duration-200 bg-white ltr"
               required
             />
             <div className="text-xs text-gray-500 text-end mt-1 font-medium">
               14 رقم مطلوب
             </div>
           </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center flex items-center justify-center gap-2">
              <span className="text-red-500">⚠️</span>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-center flex items-center justify-center gap-2">
              <span className="text-green-500">✅</span>
              {success}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-4 text-lg font-bold mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={loading || success}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري الحفظ...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                التالي
                <span className="text-xl">→</span>
              </span>
            )}
          </Button>
        </form>
        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span className="text-blue-500">🔒</span>
              <span>جميع البيانات سرية ومؤمنة وتستخدم فقط للتحقق من هويتك</span>
            </div>
          </div>
        </div>
      </motion.div>
      <style jsx global>{`
        /* ... (جزء الـ CSS لم يتغير) ... */
      `}</style>
    </div>
  );
}