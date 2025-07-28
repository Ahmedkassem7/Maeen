import { Users, Calendar } from "lucide-react";

const TabButton = ({
  id,
  label,
  icon: Icon,
  count,
  activeTab,
  setActiveTab,
}) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden ${
      activeTab === id
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
        : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-102"
    }`}
  >
    {/* Background gradient overlay for active state */}
    {activeTab === id && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    )}

    <div className="flex items-center gap-3 relative z-10">
      <div
        className={`p-2 rounded-lg transition-colors ${
          activeTab === id
            ? "bg-white/20"
            : "bg-white shadow-sm group-hover:shadow-md"
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            activeTab === id ? "text-white" : "text-gray-600"
          }`}
        />
      </div>
      <span className="font-medium">{label}</span>
    </div>

    {count !== undefined && (
      <div
        className={`px-2.5 py-1 rounded-full text-xs font-bold relative z-10 ${
          activeTab === id
            ? "bg-white/20 text-white"
            : "bg-blue-100 text-blue-600"
        }`}
      >
        {count}
      </div>
    )}
  </button>
);

export default function EpisodeTabsSidebar({
  activeTab,
  setActiveTab,
  chatCount,
  studentsCount,
  timelineCount,
}) {
  return (
    <div className="space-y-3">
      <TabButton
        id="students"
        label="الطلاب"
        icon={Users}
        count={studentsCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <TabButton
        id="timeline"
        label="الجدول الزمني"
        icon={Calendar}
        count={timelineCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
