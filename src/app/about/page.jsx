import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_component/ui/Card";
import {
  BookOpen,
  Users,
  Award,
  Heart,
  Star,
  Target,
  Eye,
  Sparkles,
  Zap,
} from "lucide-react";

const About = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50"
      dir="rtl"
    >
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-islamic-blue via-blue-700 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full bg-repeat animate-pulse"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3Cpath d='M40 20a20 20 0 110 40 20 20 0 010-40zm0 8a12 12 0 100 24 12 12 0 000-24z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-8 h-8 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute top-40 right-20 w-6 h-6 bg-white/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-4 h-4 bg-white/15 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative max-w-6xl mx-auto px-4 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/15 rounded-full mb-8 backdrop-blur-sm shadow-xl hover:scale-110 transition-transform duration-500">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-[36px] md:text-[60px] font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
              من نحن
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              منصة مُعِين هي منصة تعليمية متخصصة في تعليم القرآن الكريم والعلوم
              الإسلامية، تهدف إلى تقديم تعليم عالي الجودة يجمع بين الأصالة
              والحداثة
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium">تعليم متميز</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Zap className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">تقنيات حديثة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative">
        {/* Enhanced Decorative Elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-r from-emerald-200 to-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-500"></div>

        {/* Mission & Vision with Enhanced Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24">
          <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-b from-blue-500 to-blue-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top"></div>

            {/* Decorative corner element */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-br-full"></div>

            <CardHeader className="relative z-10 pb-6">
              <CardTitle className="flex items-center gap-4 text-2xl">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <span className="text-gray-800 font-bold">رسالتنا</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-0 pb-8">
              <p className="text-gray-700 leading-relaxed text-lg font-medium">
                تقديم تعليم قرآني متميز يجمع بين الأصالة والحداثة، مع الاهتمام
                بجودة التعليم وتنمية مهارات الطلاب في حفظ وتلاوة القرآن الكريم
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-b from-emerald-500 to-emerald-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top"></div>

            {/* Decorative corner element */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-br-full"></div>

            <CardHeader className="relative z-10 pb-6">
              <CardTitle className="flex items-center gap-4 text-2xl">
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <span className="text-gray-800 font-bold">رؤيتنا</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-0 pb-8">
              <p className="text-gray-700 leading-relaxed text-lg font-medium">
                أن نكون المنصة الرائدة في تعليم القرآن الكريم والعلوم الإسلامية،
                ونساهم في إعداد جيل قرآني متميز يخدم دينه ومجتمعه
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Stats Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-emerald-100 px-6 py-3 rounded-full mb-6">
              <Star className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">
                إنجازاتنا المتميزة
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              أرقامنا تتحدث
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              نفتخر بالإنجازات التي حققناها خلال رحلتنا في تعليم القرآن الكريم
              والعلوم الإسلامية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 bg-gradient-to-br from-blue-50 via-white to-blue-50/30 text-center hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
              <CardContent className="relative z-10 pt-10 pb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:-rotate-6 transform transition-all duration-500">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text mb-3">
                  100+
                </div>
                <p className="text-gray-700 font-semibold text-lg">طالب</p>
                <div className="mt-2 h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto"></div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 text-center hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
              <CardContent className="relative z-10 pt-10 pb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:-rotate-6 transform transition-all duration-500">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text mb-3">
                  20+
                </div>
                <p className="text-gray-700 font-semibold text-lg">معلم</p>
                <div className="mt-2 h-1 w-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full mx-auto"></div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 bg-gradient-to-br from-orange-50 via-white to-orange-50/30 text-center hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
              <CardContent className="relative z-10 pt-10 pb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:-rotate-6 transform transition-all duration-500">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text mb-3">
                  25+
                </div>
                <p className="text-gray-700 font-semibold text-lg">
                  حلقة تعليمية
                </p>
                <div className="mt-2 h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto"></div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 bg-gradient-to-br from-red-50 via-white to-red-50/30 text-center hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
              <CardContent className="relative z-10 pt-10 pb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:-rotate-6 transform transition-all duration-500">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-red-600 to-red-700 bg-clip-text mb-3">
                  1
                </div>
                <p className="text-gray-700 font-semibold text-lg">
                  سنوات خبرة
                </p>
                <div className="mt-2 h-1 w-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto"></div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Values Section */}
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-emerald-600/5"></div>

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-200/30 to-transparent rounded-tr-full"></div>

          <CardHeader className="relative z-10 text-center pb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl mb-8 shadow-xl hover:scale-110 transition-transform duration-500">
              <Star className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              قيمنا
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              المبادئ الأساسية التي نتبعها في رحلتنا التعليمية لتحقيق التميز
              والجودة في التعليم القرآني
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 px-8 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="group text-center p-8 rounded-3xl bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-6 text-gray-800">
                  التميز التعليمي
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  نلتزم بتقديم أعلى معايير التعليم القرآني مع استخدام أحدث الطرق
                  والتقنيات التعليمية المبتكرة
                </p>
                <div className="mt-6 h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto"></div>
              </div>

              <div className="group text-center p-8 rounded-3xl bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-6 text-gray-800">
                  الاهتمام بالطلاب
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  نضع احتياجات الطلاب في مقدمة أولوياتنا ونسعى لتوفير بيئة
                  تعليمية محفزة وداعمة للنمو والتطور
                </p>
                <div className="mt-6 h-1 w-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full mx-auto"></div>
              </div>

              <div className="group text-center p-8 rounded-3xl bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <Award className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-6 text-gray-800">
                  الجودة والابتكار
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  نسعى للتطوير المستمر والابتكار في التعليم لضمان تجربة تعليمية
                  متميزة ومواكبة للتطورات الحديثة
                </p>
                <div className="mt-6 h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
