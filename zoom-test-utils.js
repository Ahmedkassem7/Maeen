// اختبار سريع لوظائف Zoom
// يمكن تشغيل هذا الكود في console المتصفح لاختبار النظام

// 1. اختبار تحميل Zoom SDK
function testZoomSDKLoading() {
  console.log("🧪 اختبار تحميل Zoom SDK...");

  if (window.ZoomMtgEmbedded) {
    console.log("✅ Zoom SDK محمل بنجاح");
    return true;
  } else {
    console.log("❌ Zoom SDK غير محمل");
    return false;
  }
}

// 2. اختبار إنشاء client
function testZoomClient() {
  console.log("🧪 اختبار إنشاء Zoom Client...");

  if (!window.ZoomMtgEmbedded) {
    console.log("❌ Zoom SDK غير متاح");
    return false;
  }

  try {
    const client = window.ZoomMtgEmbedded.createClient();
    console.log("✅ تم إنشاء Zoom Client بنجاح");
    return client;
  } catch (error) {
    console.log("❌ فشل في إنشاء Zoom Client:", error);
    return false;
  }
}

// 3. اختبار الحصول على التوقيع
async function testSignatureAPI(meetingNumber = "123456789", role = 0) {
  console.log("🧪 اختبار API التوقيع...");

  try {
    const response = await fetch(
      "https://backend-ui4w.onrender.com/api/v1/zoom/signature",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingNumber, role }),
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      console.log("✅ تم الحصول على التوقيع بنجاح");
      return data.data.signature;
    } else {
      console.log("❌ فشل في الحصول على التوقيع:", data.message);
      return false;
    }
  } catch (error) {
    console.log("❌ خطأ في استدعاء API:", error);
    return false;
  }
}

// 4. اختبار بيانات الحلقة
function testEpisodeData(episode) {
  console.log("🧪 اختبار بيانات الحلقة...");

  if (!episode) {
    console.log("❌ لا توجد بيانات حلقة");
    return false;
  }

  console.log("📊 بيانات الحلقة:", episode);

  const zoomMeeting = episode.zoomMeeting;
  if (!zoomMeeting) {
    console.log("❌ لا توجد بيانات Zoom في الحلقة");
    return false;
  }

  const meetingId = zoomMeeting.meetingId || zoomMeeting.meetingNumber;
  if (!meetingId) {
    console.log("❌ معرف الاجتماع مفقود");
    return false;
  }

  console.log("✅ بيانات Zoom صحيحة:");
  console.log("   - معرف الاجتماع:", meetingId);
  console.log("   - كلمة المرور:", zoomMeeting.password || "غير محددة");

  return true;
}

// 5. اختبار معاملات URL
function testURLParams() {
  console.log("🧪 اختبار معاملات URL...");

  const urlParams = new URLSearchParams(window.location.search);
  const requiredParams = ["meetingNumber", "userName"];
  const optionalParams = ["meetingPassword", "userRole", "episodeName"];

  let allValid = true;

  requiredParams.forEach((param) => {
    const value = urlParams.get(param);
    if (!value || value === "undefined") {
      console.log(`❌ معامل مطلوب مفقود: ${param}`);
      allValid = false;
    } else {
      console.log(`✅ ${param}: ${value}`);
    }
  });

  optionalParams.forEach((param) => {
    const value = urlParams.get(param);
    console.log(`📋 ${param}: ${value || "غير محدد"}`);
  });

  return allValid;
}

// 6. تشغيل جميع الاختبارات
async function runAllTests(episode = null) {
  console.log("🚀 بدء تشغيل جميع اختبارات Zoom...");
  console.log("=".repeat(50));

  const results = {
    sdkLoading: testZoomSDKLoading(),
    clientCreation: testZoomClient(),
    urlParams: testURLParams(),
    episodeData: episode ? testEpisodeData(episode) : null,
    signatureAPI: null,
  };

  // اختبار API التوقيع إذا كان SDK محمل
  if (results.sdkLoading) {
    results.signatureAPI = await testSignatureAPI();
  }

  console.log("=".repeat(50));
  console.log("📊 ملخص النتائج:");
  Object.entries(results).forEach(([test, result]) => {
    if (result !== null) {
      const status = result ? "✅" : "❌";
      console.log(`${status} ${test}: ${result ? "نجح" : "فشل"}`);
    }
  });

  const successCount = Object.values(results).filter((r) => r === true).length;
  const totalTests = Object.values(results).filter((r) => r !== null).length;

  console.log(
    `🎯 النتيجة النهائية: ${successCount}/${totalTests} اختبارات نجحت`
  );

  return results;
}

// 7. اختبار سريع لصفحة الاجتماع
function quickMeetingTest() {
  console.log("⚡ اختبار سريع لصفحة الاجتماع...");

  const meetingElement = document.getElementById("meetingSDKElement");
  if (meetingElement) {
    console.log("✅ عنصر الاجتماع موجود");
  } else {
    console.log("❌ عنصر الاجتماع مفقود");
  }

  // التحقق من وجود المتغيرات العامة
  const globalVars = ["meetingNumber", "userName", "userRole"];
  globalVars.forEach((varName) => {
    if (window[varName]) {
      console.log(`✅ ${varName}: ${window[varName]}`);
    }
  });
}

// 8. مساعد لتصحيح الأخطاء
function debugZoomIssue() {
  console.log("🔧 تشخيص مشاكل Zoom...");

  // فحص الشبكة
  if (navigator.onLine) {
    console.log("✅ الاتصال بالإنترنت متاح");
  } else {
    console.log("❌ لا يوجد اتصال بالإنترنت");
  }

  // فحص المتصفح
  console.log("🌐 معلومات المتصفح:");
  console.log("   - User Agent:", navigator.userAgent);
  console.log("   - Language:", navigator.language);

  // فحص أخطاء JavaScript
  const errors = window.errors || [];
  if (errors.length > 0) {
    console.log("❌ أخطاء JavaScript موجودة:");
    errors.forEach((error) => console.log("   -", error));
  } else {
    console.log("✅ لا توجد أخطاء JavaScript");
  }
}

// إتاحة الوظائف عالمياً للاستخدام في console
window.zoomTests = {
  testZoomSDKLoading,
  testZoomClient,
  testSignatureAPI,
  testEpisodeData,
  testURLParams,
  runAllTests,
  quickMeetingTest,
  debugZoomIssue,
};

console.log("🎯 أدوات اختبار Zoom متاحة الآن!");
console.log("استخدم: window.zoomTests.runAllTests() لتشغيل جميع الاختبارات");
console.log("أو: window.zoomTests.quickMeetingTest() للاختبار السريع");
