import {
  Search,
  User,
  MessageCircle,
  Clock,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import Avatar from "../ui/Avatar";
import { memo, useState, useMemo } from "react";
import Toast from "../shared/toast/Toast";
import Loading from "@/app/_component/shared/loading/Loading";
import "./chat-styles.css";

const ConversationItem = memo(
  ({ conversation, isSelected, isOnline, unreadCount, onClick }) => {
    const { user, lastMessage } = conversation;

    const formatMessagePreview = (message) => {
      if (!message) return "لا توجد رسائل";
      return message.length > 40 ? `${message.substring(0, 40)}...` : message;
    };

    const formatTimeAgo = (timestamp) => {
      if (!timestamp) return "";
      const now = new Date();
      const messageTime = new Date(timestamp);
      const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

      if (diffInMinutes < 1) return "الآن";
      if (diffInMinutes < 60) return `${diffInMinutes} د`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} س`;
      return `${Math.floor(diffInMinutes / 1440)} ي`;
    };

    return (
      <div
        onClick={onClick}
        className={`
        group relative p-3 rounded-xl cursor-pointer transition-all duration-300 mb-1.5
        transform hover:scale-[1.01] hover:shadow-lg
        ${
          isSelected
            ? "bg-gradient-to-r from-[#0b1b49] via-[#1e3a8a] to-[#0b1b49] text-white shadow-xl scale-[1.02]"
            : "hover:bg-gradient-to-r hover:from-white hover:to-blue-50/50 border border-gray-100/50 bg-white/70 backdrop-blur-sm"
        }
        before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
      `}
      >
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full shadow-lg" />
        )}

        {/* Online Pulse Effect */}
        {isOnline && !isSelected && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        )}

        <div className="flex items-center space-x-3 rtl:space-x-reverse relative z-10">
          <Avatar
            user={user}
            size="sm"
            isOnline={isOnline}
            showRole={true}
            className={`${
              isSelected ? "  shadow-lg" : "shadow-md"
            } transition-all duration-300`}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4
                className={`
              font-bold truncate text-sm transition-colors duration-300
              ${isSelected ? "text-white" : "text-gray-900"}
            `}
              >
                {user.firstName} {user.lastName}
              </h4>

              <div className="flex items-center gap-2 shrink-0">
                {unreadCount > 0 && (
                  <Badge
                    className={`
                  text-xs min-w-[22px] h-6 flex items-center justify-center font-bold
                  ${
                    isSelected
                      ? "bg-white text-[#0b1b49] shadow-lg"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                  }
                  animate-pulse transition-all duration-300
                `}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}

                {lastMessage?.createdAt && (
                  <span
                    className={`
                  text-xs flex items-center gap-1 transition-colors duration-300
                  ${isSelected ? "text-blue-100" : "text-gray-500"}
                `}
                  >
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(lastMessage.createdAt)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle
                className={`
              w-3 h-3 shrink-0 transition-colors duration-300
              ${isSelected ? "text-blue-200" : "text-gray-400"}
            `}
              />
              <p
                className={`
              text-xs truncate transition-colors duration-300
              ${isSelected ? "text-blue-100" : "text-gray-600"}
            `}
              >
                {formatMessagePreview(lastMessage?.message)}
              </p>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        {!isSelected && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1b49]/3 via-blue-500/3 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
        )}
      </div>
    );
  }
);

ConversationItem.displayName = "ConversationItem";

const ConversationsList = ({
  searchQuery,
  setSearchQuery,
  loading,
  filteredConversations,
  selectedUser,
  onlineUsers,
  unreadCounts,
  onSelectUser,
  searchPlaceholder = "البحث عن مستخدم...",
  title = "المحادثات النشطة",
  onRefresh,
}) => {
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  // فقط المحادثات التي بها اسم حقيقي
  const realConversations = useMemo(
    () =>
      filteredConversations.filter(
        (conv) =>
          conv.user &&
          conv.user.firstName &&
          conv.user.firstName !== "اسم غير معروف"
      ),
    [filteredConversations]
  );

  const totalUnreadCount = useMemo(
    () =>
      realConversations.reduce(
        (sum, conv) => sum + (unreadCounts[conv.user._id] || 0),
        0
      ),
    [realConversations, unreadCounts]
  );

  const onlineCount = useMemo(
    () =>
      realConversations.filter(
        (conv) => conv.user && onlineUsers.includes(conv.user._id)
      ).length,
    [realConversations, onlineUsers]
  );

  return (
    <div className="w-full md:w-80 bg-white/80 backdrop-blur-md border-l border-gray-200/50 flex flex-col flex-shrink-0 h-full shadow-2xl overflow-hidden">
      {/* Enhanced Header */}
      <div className="p-3 bg-gradient-to-r from-[#0b1b49] via-[#1e3a8a] to-[#0b1b49] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 disabled:opacity-50 backdrop-blur-sm group"
                  title="تحديث المحادثات"
                >
                  <RefreshCw
                    className={`h-4 w-4 transition-transform duration-300 ${
                      loading ? "animate-spin" : "group-hover:rotate-180"
                    }`}
                  />
                </button>
              )}
              {totalUnreadCount > 0 && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse shadow-lg px-3 py-1">
                  {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                </Badge>
              )}
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
              {onlineCount > 0 ? (
                <>
                  <Wifi className="w-4 h-4 text-green-300" />
                  <span className="text-green-100">{onlineCount} متصل</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-200">لا يوجد متصلين</span>
                </>
              )}
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200/80" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="
                w-full pr-10 pl-3 py-2.5 
                bg-white/10 backdrop-blur-sm
                border border-white/20 rounded-xl 
                text-white placeholder-blue-200/80 text-sm
                focus:bg-white/20 focus:border-white/40 focus:outline-none 
                transition-all duration-300 font-arabic text-right
                hover:bg-white/15
              "
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors duration-200"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-gradient-to-b from-gray-50/50 to-white/50 backdrop-blur-sm">
        <div className="p-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              {/* <Loading message="جاري تحميل المحادثات..." /> */}
              <span className="text-gray-500">جاري تحميل المحادثات...</span>
            </div>
          ) : realConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-gray-700 font-bold mb-2 text-lg">
                لا توجد محادثات
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {searchQuery
                  ? "لم يتم العثور على نتائج للبحث"
                  : "ابدأ محادثة جديدة مع أحد المستخدمين"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 px-4 py-2 bg-[#0b1b49] text-white rounded-lg text-sm hover:bg-[#0b1b49]/90 transition-colors duration-200"
                >
                  مسح البحث
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Active Conversations */}
              <div className="space-y-2">
                {realConversations.map((conv) => {
                  if (!conv.user) return null;
                  return (
                    <ConversationItem
                      key={conv.conversationId}
                      conversation={conv}
                      isSelected={
                        selectedUser && selectedUser._id === conv.user._id
                      }
                      isOnline={onlineUsers.includes(conv.user._id)}
                      unreadCount={unreadCounts[conv.user._id] || 0}
                      onClick={() => onSelectUser(conv.user)}
                    />
                  );
                })}
              </div>

              {/* Enhanced Statistics */}
              <div className="mt-4 p-3 bg-gradient-to-r from-white to-blue-50/50 rounded-xl border border-gray-100/50 shadow-sm backdrop-blur-sm">
                <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0b1b49] rounded-full"></div>
                  إحصائيات سريعة
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-white/70 rounded-lg border border-gray-100">
                    <div className="text-base font-bold text-[#0b1b49] mb-1">
                      {realConversations.length}
                    </div>
                    <div className="text-xs text-gray-600">
                      إجمالي المحادثات
                    </div>
                  </div>
                  <div className="text-center p-2 bg-white/70 rounded-lg border border-gray-100">
                    <div className="text-base font-bold text-green-600 mb-1">
                      {onlineCount}
                    </div>
                    <div className="text-xs text-gray-600">المتصلون الآن</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Toast
        show={toastState.show}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default ConversationsList;
