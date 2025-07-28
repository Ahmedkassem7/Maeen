"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  MessageCircle,
  Video,
  Wallet,
  CreditCard,
  User,
  Shield,
  Calendar,
  Star,
  Award,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Info,
  GraduationCap,
  Clock,
  TrendingUp,
  FileText,
  Bell,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Play,
  Pause,
  Stop,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share,
  Download,
  Upload,
  Edit,
  Trash,
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Save,
  X,
  Minus,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  SignalZero,
} from "lucide-react";
import { Button } from "../_component/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../_component/ui/Card";
import { Badge } from "../_component/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../_component/ui/tabs";

const UserManual = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const features = [
    {
      id: "authentication",
      title: "نظام المصادقة والتسجيل",
      icon: Shield,
      color: "from-blue-500 to-blue-600",
      sections: [
        {
          title: "تسجيل حساب جديد",
          content: [
            "انتقل إلى صفحة التسجيل من القائمة الرئيسية",
            "أدخل البيانات المطلوبة: الاسم الأول والأخير، البريد الإلكتروني، كلمة المرور",
            "اختر نوع الحساب: معلم أو طالب",
            "أدخل بيانات إضافية: الجنس، البلد",
            "اضغط على 'إنشاء حساب'",
            "تحقق من بريدك الإلكتروني لتفعيل الحساب"
          ]
        },
        {
          title: "تسجيل الدخول",
          content: [
            "أدخل بريدك الإلكتروني وكلمة المرور",
            "اضغط على 'تسجيل الدخول'",
            "سيتم توجيهك تلقائياً إلى لوحة التحكم المناسبة"
          ]
        },
        {
          title: "نسيت كلمة المرور",
          content: [
            "اضغط على 'نسيت كلمة المرور' في صفحة تسجيل الدخول",
            "أدخل بريدك الإلكتروني",
            "تحقق من بريدك للحصول على رمز التحقق",
            "أدخل الرمز في صفحة التحقق",
            "أنشئ كلمة مرور جديدة"
          ]
        },
        {
          title: "تأكيد البريد الإلكتروني",
          content: [
            "بعد التسجيل، ستتلقى رابط تأكيد في بريدك الإلكتروني",
            "اضغط على الرابط لتأكيد حسابك",
            "يمكنك الآن تسجيل الدخول بشكل كامل"
          ]
        }
      ]
    },
    {
      id: "teacher-dashboard",
      title: "لوحة تحكم المعلم",
      icon: GraduationCap,
      color: "from-green-500 to-green-600",
      sections: [
        {
          title: "نظرة عامة",
          content: [
            "عرض إحصائيات الحلقات: العدد الإجمالي، الحلقات النشطة، الطلاب المسجلين",
            "معلومات الجلسات اليومية",
            "رصيد المحفظة والمدفوعات",
            "إشعارات جديدة"
          ]
        },
        {
          title: "إدارة الحلقات",
          content: [
            "إنشاء حلقة جديدة: اضغط على 'إضافة حلقة'",
            "تعديل الحلقات الموجودة",
            "إدارة الطلاب المسجلين",
            "تتبع تقدم الطلاب",
            "جدولة الجلسات"
          ]
        },
        {
          title: "إدارة الجلسات",
          content: [
            "إنشاء جلسة زووم جديدة",
            "إدارة الجلسات المباشرة",
            "تسجيل الحضور",
            "إضافة ملاحظات وتقييمات"
          ]
        },
        {
          title: "نظام المحادثات",
          content: [
            "محادثات فردية مع الطلاب",
            "محادثات جماعية للحلقات",
            "إرسال واستقبال الرسائل",
            "مشاركة الملفات والروابط"
          ]
        }
      ]
    },
    {
      id: "student-dashboard",
      title: "لوحة تحكم الطالب",
      icon: User,
      color: "from-purple-500 to-purple-600",
      sections: [
        {
          title: "نظرة عامة",
          content: [
            "عرض الحلقات المسجل فيها",
            "الجلسات القادمة اليوم",
            "تقدم التعلم والإنجازات",
            "الإشعارات والدعوات الجديدة"
          ]
        },
        {
          title: "استكشاف الحلقات",
          content: [
            "تصفح الحلقات المتاحة",
            "فلترة حسب المنهج والسعر",
            "عرض تفاصيل الحلقة والمعلم",
            "التسجيل في الحلقات"
          ]
        },
        {
          title: "إدارة التعلم",
          content: [
            "متابعة تقدم الحلقات",
            "عرض التقييمات والملاحظات",
            "الوصول للمواد التعليمية",
            "جدولة الجلسات"
          ]
        },
        {
          title: "نظام المحادثات",
          content: [
            "التواصل مع المعلمين",
            "المحادثات الجماعية للحلقات",
            "طرح الأسئلة والاستفسارات",
            "مشاركة الملاحظات"
          ]
        }
      ]
    },
    {
      id: "video-meetings",
      title: "الاجتماعات المرئية",
      icon: Video,
      color: "from-red-500 to-red-600",
      sections: [
        {
          title: "بدء اجتماع زووم",
          content: [
            "اضغط على 'بدء الجلسة' في الحلقة",
            "انتظار تحميل واجهة زووم",
            "تأكد من إعدادات الكاميرا والميكروفون",
            "انضم للاجتماع كمعلم أو طالب"
          ]
        },
        {
          title: "إعدادات الاجتماع",
          content: [
            "تشغيل/إيقاف الكاميرا",
            "تشغيل/إيقاف الميكروفون",
            "مشاركة الشاشة",
            "إدارة المشاركين",
            "تسجيل الاجتماع"
          ]
        },
        {
          title: "أدوات التفاعل",
          content: [
            "رفع اليد للأسئلة",
            "الرد على الاستطلاعات",
            "إرسال رسائل في الدردشة",
            "استخدام السبورة التفاعلية"
          ]
        },
        {
          title: "مشاكل وحلول",
          content: [
            "تأكد من اتصال الإنترنت المستقر",
            "تحقق من إعدادات المتصفح",
            "أعد تحميل الصفحة إذا لزم الأمر",
            "تواصل مع الدعم الفني"
          ]
        }
      ]
    },
    {
      id: "chat-system",
      title: "نظام المحادثات",
      icon: MessageCircle,
      color: "from-indigo-500 to-indigo-600",
      sections: [
        {
          title: "المحادثات الفردية",
          content: [
            "اختر مستخدم من قائمة المحادثات",
            "أرسل رسائل نصية",
            "مشاركة الصور والملفات",
            "عرض حالة الاتصال"
          ]
        },
        {
          title: "المحادثات الجماعية",
          content: [
            "انضم لمحادثة الحلقة",
            "تفاعل مع المعلم والطلاب الآخرين",
            "مشاركة الموارد التعليمية",
            "إدارة الإعدادات"
          ]
        },
        {
          title: "إعدادات المحادثة",
          content: [
            "تفعيل/إلغاء الإشعارات",
            "تخصيص الأصوات",
            "إدارة الملفات المشتركة",
            "حظر المستخدمين"
          ]
        }
      ]
    },
    {
      id: "enrollment-payment",
      title: "التسجيل والدفع",
      icon: CreditCard,
      color: "from-yellow-500 to-yellow-600",
      sections: [
        {
          title: "التسجيل في الحلقات",
          content: [
            "اختر الحلقة المطلوبة",
            "اضغط على 'التسجيل'",
            "أدخل بيانات الدفع",
            "اختر طريقة الدفع: بطاقة ائتمان أو محفظة رقمية"
          ]
        },
        {
          title: "طرق الدفع",
          content: [
            "بطاقة ائتمان/خصم: إدخال بيانات البطاقة",
            "محفظة رقمية: إدخال رقم المحفظة",
            "التحقق من المبلغ والتفاصيل",
            "تأكيد عملية الدفع"
          ]
        },
        {
          title: "إدارة المدفوعات",
          content: [
            "عرض سجل المدفوعات",
            "تحميل فواتير الدفع",
            "طلب استرداد الأموال",
            "تحديث بيانات الدفع"
          ]
        }
      ]
    },
    {
      id: "wallet-system",
      title: "نظام المحفظة",
      icon: Wallet,
      color: "from-emerald-500 to-emerald-600",
      sections: [
        {
          title: "إدارة الرصيد",
          content: [
            "عرض الرصيد الحالي",
            "إضافة رصيد جديد",
            "سحب الأموال",
            "عرض سجل المعاملات"
          ]
        },
        {
          title: "بيانات البنك",
          content: [
            "إضافة بيانات البنك",
            "تحديث المعلومات المصرفية",
            "التحقق من صحة البيانات",
            "إدارة الحسابات المتعددة"
          ]
        },
        {
          title: "طلبات السحب",
          content: [
            "إنشاء طلب سحب جديد",
            "تحديد المبلغ المطلوب",
            "اختيار حساب البنك",
            "متابعة حالة الطلب"
          ]
        }
      ]
    },
    {
      id: "progress-tracking",
      title: "تتبع التقدم",
      icon: TrendingUp,
      color: "from-pink-500 to-pink-600",
      sections: [
        {
          title: "تقييم الطلاب",
          content: [
            "إعطاء درجات للجلسات",
            "إضافة ملاحظات وتقييمات",
            "متابعة التقدم العام",
            "إنشاء تقارير الأداء"
          ]
        },
        {
          title: "متابعة التقدم",
          content: [
            "عرض الإحصائيات الشخصية",
            "مقارنة الأداء مع الأهداف",
            "تحديد نقاط القوة والضعف",
            "وضع خطط التحسين"
          ]
        },
        {
          title: "التقارير والإحصائيات",
          content: [
            "تقارير الحضور",
            "إحصائيات الأداء",
            "مقارنات زمنية",
            "تحليلات مفصلة"
          ]
        }
      ]
    },
    {
      id: "notifications",
      title: "نظام الإشعارات",
      icon: Bell,
      color: "from-orange-500 to-orange-600",
      sections: [
        {
          title: "أنواع الإشعارات",
          content: [
            "إشعارات الجلسات الجديدة",
            "تذكيرات المواعيد",
            "رسائل جديدة",
            "تحديثات الحلقات",
            "إشعارات الدفع"
          ]
        },
        {
          title: "إدارة الإشعارات",
          content: [
            "تفعيل/إلغاء الإشعارات",
            "تخصيص أنواع الإشعارات",
            "إعداد أوقات الإشعارات",
            "حذف الإشعارات القديمة"
          ]
        }
      ]
    },
    {
      id: "profile-settings",
      title: "الملف الشخصي والإعدادات",
      icon: Settings,
      color: "from-gray-500 to-gray-600",
      sections: [
        {
          title: "تعديل الملف الشخصي",
          content: [
            "تحديث المعلومات الشخصية",
            "تغيير الصورة الشخصية",
            "إدارة البيانات التعليمية",
            "تحديث بيانات الاتصال"
          ]
        },
        {
          title: "إعدادات الحساب",
          content: [
            "تغيير كلمة المرور",
            "إعدادات الخصوصية",
            "تفضيلات الإشعارات",
            "إعدادات اللغة"
          ]
        },
        {
          title: "الأمان والخصوصية",
          content: [
            "تفعيل المصادقة الثنائية",
            "إدارة الأجهزة المتصلة",
            "سجل تسجيلات الدخول",
            "إعدادات الخصوصية"
          ]
        }
      ]
    },
    {
      id: "mobile-app",
      title: "التطبيق المحمول",
      icon: Phone,
      color: "from-teal-500 to-teal-600",
      sections: [
        {
          title: "ميزات التطبيق",
          content: [
            "واجهة محسنة للموبايل",
            "إشعارات فورية",
            "الوصول السريع للحلقات",
            "مشاركة الشاشة المحسنة"
          ]
        },
        {
          title: "التثبيت والاستخدام",
          content: [
            "تحميل التطبيق من المتجر",
            "تسجيل الدخول بالحساب الحالي",
            "مزامنة البيانات",
            "إعدادات التطبيق"
          ]
        }
      ]
    },
    {
      id: "troubleshooting",
      title: "استكشاف الأخطاء",
      icon: HelpCircle,
      color: "from-red-400 to-red-500",
      sections: [
        {
          title: "مشاكل شائعة",
          content: [
            "مشاكل تسجيل الدخول: تحقق من البريد الإلكتروني وكلمة المرور",
            "مشاكل الاتصال: تحقق من الإنترنت وإعادة تحميل الصفحة",
            "مشاكل الفيديو: تحقق من إعدادات الكاميرا والميكروفون",
            "مشاكل الدفع: تحقق من بيانات البطاقة أو المحفظة"
          ]
        },
        {
          title: "الحصول على المساعدة",
          content: [
            "صفحة المساعدة والدعم",
            "التواصل مع خدمة العملاء",
            "الدردشة المباشرة مع الدعم",
            "إرسال تقرير مشكلة"
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-islamic-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
            dir="rtl"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <HelpCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-right">
              دليل المستخدم الشامل
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed text-right">
              دليل شامل لجميع ميزات منصة تعليم القرآن الكريم والعلوم الإسلامية
            </p>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="all" className="text-right">الكل</TabsTrigger>
            <TabsTrigger value="auth" className="text-right">المصادقة</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-right">لوحات التحكم</TabsTrigger>
            <TabsTrigger value="meetings" className="text-right">الاجتماعات</TabsTrigger>
            <TabsTrigger value="communication" className="text-right">التواصل</TabsTrigger>
            <TabsTrigger value="payment" className="text-right">الدفع</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-lg border-0 overflow-hidden">
                    <CardHeader
                      className={`bg-gradient-to-r ${feature.color} text-white cursor-pointer`}
                      onClick={() => toggleSection(feature.id)}
                      dir="rtl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-white/20 p-3 rounded-full">
                            <feature.icon className="h-6 w-6 text-white" />
                          </div>
                          <CardTitle className="text-xl text-right">{feature.title}</CardTitle>
                        </div>
                        {expandedSections[feature.id] ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </CardHeader>

                    {expandedSections[feature.id] && (
                      <CardContent className="p-6" dir="rtl">
                        <div className="grid gap-6">
                          {feature.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="border-b border-gray-100 pb-4 last:border-b-0">
                              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2 text-right">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                {section.title}
                              </h3>
                              <ul className="space-y-2 text-right">
                                {section.content.map((item, itemIndex) => (
                                  <li key={itemIndex} className="flex items-start gap-3 text-gray-600 text-right">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="auth" className="mt-8">
            <div className="grid gap-6">
              {features.filter(f => f.id === "authentication").map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-lg border-0 overflow-hidden">
                    <CardHeader className={`bg-gradient-to-r ${feature.color} text-white`} dir="rtl">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-right">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6" dir="rtl">
                      <div className="grid gap-6">
                        {feature.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2 text-right">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              {section.title}
                            </h3>
                            <ul className="space-y-2 text-right">
                              {section.content.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start gap-3 text-gray-600 text-right">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-8">
            <div className="grid gap-6">
              {features.filter(f => f.id === "teacher-dashboard" || f.id === "student-dashboard").map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-lg border-0 overflow-hidden">
                    <CardHeader className={`bg-gradient-to-r ${feature.color} text-white`} dir="rtl">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-right">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6" dir="rtl">
                      <div className="grid gap-6">
                        {feature.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2 text-right">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              {section.title}
                            </h3>
                            <ul className="space-y-2 text-right">
                              {section.content.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start gap-3 text-gray-600 text-right">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="meetings" className="mt-8">
            <div className="grid gap-6">
              {features.filter(f => f.id === "video-meetings").map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-lg border-0 overflow-hidden">
                    <CardHeader className={`bg-gradient-to-r ${feature.color} text-white`} dir="rtl">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-right">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6" dir="rtl">
                      <div className="grid gap-6">
                        {feature.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2 text-right">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              {section.title}
                            </h3>
                            <ul className="space-y-2 text-right">
                              {section.content.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start gap-3 text-gray-600 text-right">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communication" className="mt-8">
            <div className="grid gap-6">
              {features.filter(f => f.id === "chat-system" || f.id === "notifications").map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-lg border-0 overflow-hidden">
                    <CardHeader className={`bg-gradient-to-r ${feature.color} text-white`} dir="rtl">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-right">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6" dir="rtl">
                      <div className="grid gap-6">
                        {feature.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2 text-right">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              {section.title}
                            </h3>
                            <ul className="space-y-2 text-right">
                              {section.content.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start gap-3 text-gray-600 text-right">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-8">
            <div className="grid gap-6">
              {features.filter(f => f.id === "enrollment-payment" || f.id === "wallet-system").map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-lg border-0 overflow-hidden">
                    <CardHeader className={`bg-gradient-to-r ${feature.color} text-white`} dir="rtl">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-right">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6" dir="rtl">
                      <div className="grid gap-6">
                        {feature.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2 text-right">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              {section.title}
                            </h3>
                            <ul className="space-y-2 text-right">
                              {section.content.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start gap-3 text-gray-600 text-right">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Tips Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-right">نصائح سريعة</h2>
            <p className="text-gray-600 text-right">أفضل الممارسات لاستخدام المنصة بكفاءة</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md" dir="rtl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-right">الأمان</h3>
              </div>
              <p className="text-gray-600 text-sm text-right">
                احرص على تغيير كلمة المرور بانتظام وتفعيل المصادقة الثنائية لحماية حسابك.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md" dir="rtl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-right">المواعيد</h3>
              </div>
              <p className="text-gray-600 text-sm text-right">
                تأكد من الانضمام للجلسات في الوقت المحدد واختبار الاتصال قبل بدء الاجتماع.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md" dir="rtl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-right">التواصل</h3>
              </div>
              <p className="text-gray-600 text-sm text-right">
                استخدم نظام المحادثات للتواصل مع المعلمين والطلاب الآخرين بفعالية.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md" dir="rtl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-right">التقدم</h3>
              </div>
              <p className="text-gray-600 text-sm text-right">
                راجع تقدمك بانتظام واستخدم التقارير لتحسين أدائك التعليمي.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md" dir="rtl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <Video className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-right">الفيديو</h3>
              </div>
              <p className="text-gray-600 text-sm text-right">
                تأكد من إعدادات الكاميرا والميكروفون قبل بدء الجلسات المرئية.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md" dir="rtl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <HelpCircle className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-right">الدعم</h3>
              </div>
              <p className="text-gray-600 text-sm text-right">
                لا تتردد في التواصل مع فريق الدعم عند مواجهة أي مشاكل أو أسئلة.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contact Support */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-islamic-blue to-blue-700 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-right">هل تحتاج مساعدة إضافية؟</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-right">
            فريق الدعم متاح على مدار الساعة لمساعدتك في أي استفسارات أو مشاكل تواجهها
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-islamic-blue hover:bg-gray-100">
              <Mail className="h-4 w-4 ml-2" />
              إرسال بريد إلكتروني
            </Button>
            <Button className="bg-white text-islamic-blue hover:bg-gray-100">
              <Phone className="h-4 w-4 ml-2" />
              الاتصال المباشر
            </Button>
            <Button className="bg-white text-islamic-blue hover:bg-gray-100">
              <MessageCircle className="h-4 w-4 ml-2" />
              الدردشة المباشرة
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserManual; 