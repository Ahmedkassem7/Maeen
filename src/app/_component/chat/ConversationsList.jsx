import { Search, User, MessageCircle, Clock } from "lucide-react";
import { Badge } from "../ui/Badge";
import { LoadingState } from "../ui/Loading";
import Avatar from "../ui/Avatar";
import { memo } from "react";
import Toast from "../shared/toast/Toast";
import { useState } from "react";

const ConversationItem = memo(
  ({ conversation, isSelected, isOnline, unreadCount, onClick }) => {
    const { user, lastMessage } = conversation;

    const formatMessagePreview = (message) => {
      if (!message) return "لا توجد رسائل";
      return message.length > 30 ? `${message.substring(0, 30)}...` : message;
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
        group relative p-4 rounded-xl cursor-pointer transition-all duration-300 mb-2
        transform hover:scale-[1.02] hover:shadow-lg
        ${
          isSelected
            ? "bg-gradient-to-r from-islamic-blue to-islamic-blue/90 text-white shadow-lg"
            : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 border border-gray-100 bg-white"
        }
      `}
      >
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full" />
        )}

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Avatar
            user={user}
            size="md"
            isOnline={isOnline}
            showRole={true}
            className={isSelected ? "ring-2 ring-white ring-opacity-30" : ""}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4
                className={`
              font-semibold truncate text-sm
              ${isSelected ? "text-white" : "text-gray-900"}
            `}
              >
                {user.firstName} {user.lastName}
              </h4>

              <div className="flex items-center gap-2 shrink-0">
                {unreadCount > 0 && (
                  <Badge
                    className={`
                  text-xs min-w-[20px] h-5 flex items-center justify-center
                  ${
                    isSelected
                      ? "bg-white text-islamic-blue"
                      : "bg-islamic-green text-white"
                  }
                  animate-pulse
                `}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}

                {lastMessage?.createdAt && (
                  <span
                    className={`
                  text-xs flex items-center gap-1
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
              w-3 h-3 shrink-0
              ${isSelected ? "text-blue-200" : "text-gray-400"}
            `}
              />
              <p
                className={`
              text-xs truncate
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
          <div className="absolute inset-0 bg-gradient-to-r from-islamic-blue/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
}) => {
  const totalUnreadCount = Object.values(unreadCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  return (
    <div className="w-full md:w-96 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 min-h-0 md:h-full shadow-sm">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-islamic-blue to-islamic-blue/90 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          {totalUnreadCount > 0 && (
            <Badge className="bg-islamic-green text-white animate-pulse">
              {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
            </Badge>
          )}
        </div>

        {/* Enhanced Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="
              w-full pr-10 pl-4 py-3 
              bg-white/10 backdrop-blur-sm
              border border-white/20 rounded-xl 
              text-white placeholder-blue-200
              focus:bg-white/20 focus:border-white/40 focus:outline-none 
              transition-all duration-300 font-arabic text-right
            "
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50">
        <div className="p-3">
          {loading ? (
            <LoadingState message="جاري تحميل المحادثات..." />
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mb-3" />
              <h3 className="text-gray-600 font-semibold mb-1">
                لا توجد محادثات
              </h3>
              <p className="text-gray-500 text-sm">ابدأ محادثة جديدة</p>
            </div>
          ) : (
            <>
              {/* Active Conversations */}
              <div className="space-y-1">
                {filteredConversations.map((conv) => (
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
                ))}
              </div>

              {/* Statistics */}
              <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>إجمالي المحادثات</span>
                  <span className="font-semibold text-islamic-blue">
                    {filteredConversations.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                  <span>المتصلون الآن</span>
                  <span className="font-semibold text-green-600">
                    {
                      filteredConversations.filter((conv) =>
                        onlineUsers.includes(conv.user._id)
                      ).length
                    }
                  </span>
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
