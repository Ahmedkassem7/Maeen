// import {
//   Send,
//   User,
//   MessageCircle,
//   ArrowRight,
//   Phone,
//   Video,
//   MoreVertical,
//   Paperclip,
//   Smile,
//   Plus,
// } from "lucide-react";
// import { Button } from "../ui/Button";
// import { LoadingSpinner } from "../ui/Loading";
// import Avatar from "../ui/Avatar";
// import MessageBubble from "../ui/MessageBubble";
// import { memo, useRef, useEffect } from "react";

import {
  Send,
  User,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Plus,
  Settings,
  UserCheck,
} from "lucide-react";
import { Button } from "../ui/Button";
import Avatar from "../ui/Avatar";
import MessageBubble from "../ui/MessageBubble";
import { memo, useRef, useEffect, useState } from "react";
// import AddHalaqaModal from "../AddHalaqa/AddHalaqaModal";
// import Loading from "@/app/_component/shared/loading/Loading";
import AddHalaqaModal from "../AddHalaqa/AddHalaqaModal";
import Loading from "@/app/_component/shared/loading/Loading";
import "./chat-styles.css";
const ChatHeader = memo(
  ({ user, isOnline, onBackToConversations, showBackButton, userRole }) => {
    // فحص وجود user
    if (!user) {
      return (
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-lg p-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <p className="text-gray-500 animate-pulse">
                جاري تحميل معلومات المستخدم...
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0C6.716 0 0 6.716 0 15s6.716 15 15 15 15-6.716 15-15S23.284 0 15 0zm0 25C9.477 25 5 20.523 5 15S9.477 5 15 5s10 4.477 10 10-4.477 10-10 10z' fill='%230b1b49' fill-opacity='0.6'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Back button for mobile */}
        {/* {showBackButton && (
          <div className="md:hidden flex items-center p-4 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/80 to-blue-50/30 backdrop-blur-sm relative z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackToConversations}
              className="hover:bg-[#0b1b49]/10 transition-all duration-200"
            >
              <ArrowRight className="h-5 w-5 text-[#0b1b49]" />
            </Button>
          </div>
        )} */}

        {/* Main header */}
        <div className="p-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                user={user}
                size="md"
                isOnline={isOnline}
                showRole={true}
                className=" shadow-lg"
              />
              <div>
                <h3 className="font-bold text-[#0b1b49] text-lg mb-0.5">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`}
                  ></div>
                  <p
                    className={`text-xs font-medium ${
                      isOnline ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isOnline ? "متصل الآن" : "غير متصل"}
                  </p>
                  {isOnline && <UserCheck className="w-3 h-3 text-green-500" />}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* زر إضافة حلقة للمعلم فقط */}
              {userRole === "teacher" && user && (
                <AddHalaqaModal
                  studentId={user._id}
                  studentName={`${user.firstName} ${user.lastName}`}
                />
              )}

              {/* Additional action buttons */}
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBackToConversations}
                  className="hover:bg-[#0b1b49]/10 transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5 text-[#0b1b49]" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChatHeader.displayName = "ChatHeader";

const MessagesContainer = memo(({ messages, selectedUser, userId }) => {
  const messagesEndRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isNearBottom]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsNearBottom(isAtBottom);
  };

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white/50 to-indigo-50/20">
        <div className="text-center max-w-sm mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#0b1b49]/10 to-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageCircle className="w-12 h-12 text-[#0b1b49]/60" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            ابدأ المحادثة
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            أرسل أول رسالة لبدء الحوار مع {selectedUser?.firstName}
          </p>
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">
              💬 ستظهر الرسائل هنا بمجرد بدء المحادثة
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative bg-gradient-to-b from-blue-50/20 via-white/30 to-indigo-50/20">
      <div
        className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar"
        onScroll={handleScroll}
      >
        <div className="p-3 space-y-2 min-h-full">
          {messages.map((msg, index) => {
            const isOwn = msg.senderId._id === userId;
            const isLastInGroup =
              index === messages.length - 1 ||
              messages[index + 1]?.senderId._id !== msg.senderId._id;

            return (
              <MessageBubble
                key={msg._id}
                message={msg.message}
                isOwn={isOwn}
                timestamp={msg.createdAt}
                isDelivered={true}
                isRead={true}
                isLastInGroup={isLastInGroup}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {!isNearBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#0b1b49] text-white p-3 rounded-full shadow-lg hover:bg-[#0b1b49]/90 transition-all duration-200 z-10"
        >
          <ArrowRight className="w-5 h-5 rotate-90" />
        </button>
      )}
    </div>
  );
});

MessagesContainer.displayName = "MessagesContainer";

const MessageInput = memo(
  ({
    message,
    onMessageChange,
    onSendMessage,
    onKeyPress,
    disabled = false,
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="p-3 bg-white/90 backdrop-blur-md border-t border-gray-200/50 shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230b1b49' fill-opacity='0.05'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="flex items-end gap-3 max-w-4xl mx-auto relative z-10">
          {/* Message input container */}
          <div className="flex-1 relative">
            <div
              className={`
              relative rounded-2xl transition-all duration-300 
              ${
                isFocused
                  ? "bg-white shadow-lg  ring-[#0b1b49]/20"
                  : "bg-gray-50/80 shadow-md hover:shadow-lg"
              }
            `}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                onKeyPress={onKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="اكتب رسالتك هنا..."
                disabled={disabled}
                className={`
                  w-full pr-12 pl-12 py-2.5 
                  bg-transparent border-0 rounded-2xl 
                  focus:outline-none 
                  transition-all duration-300 font-arabic text-right text-gray-800 text-sm
                  disabled:opacity-50 disabled:cursor-not-allowed
                  placeholder-gray-400
                `}
              />

              {/* Emoji button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0b1b49] transition-all duration-200 w-8 h-8"
                title="إضافة إيموجي"
              >
                <Smile className="h-4 w-4" />
              </Button>

              {/* Character counter for long messages */}
              {message.length > 100 && (
                <div className="absolute bottom-2 right-4 text-xs text-gray-400">
                  {message.length}/1000
                </div>
              )}
            </div>
          </div>

          {/* Send button */}
          <Button
            onClick={onSendMessage}
            disabled={!message.trim() || disabled}
            className={`
              min-w-[40px] h-10 rounded-full shadow-lg transition-all duration-300 
              ${
                message.trim() && !disabled
                  ? "bg-gradient-to-r from-[#0b1b49] via-[#1e3a8a] to-[#0b1b49] hover:shadow-xl transform hover:scale-105 active:scale-95"
                  : "bg-gray-300 cursor-not-allowed"
              }
              text-white relative overflow-hidden group
            `}
          >
            {/* Shimmer effect */}
            {message.trim() && !disabled && (
              <div className="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/20 to-transparent group-hover:top-full transition-all duration-700"></div>
            )}
            <Send className="h-4 w-4 relative z-10" />
          </Button>
        </div>

        {/* Typing indicator area */}
        <div className="mt-1 h-3 flex items-center justify-center relative z-10">
          {/* يمكن إضافة مؤشر الكتابة هنا لاحقاً */}
        </div>
      </div>
    );
  }
);

MessageInput.displayName = "MessageInput";

const MessageArea = ({
  selectedUser,
  messages,
  message,
  onlineUsers,
  userId,
  onSendMessage,
  onMessageChange,
  onKeyPress,
  onBackToConversations,
  showBackButton = false,
  isLoading = false,
  userRole = "student",
}) => {
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white/50 to-indigo-50/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230b1b49' fill-opacity='0.4'%3E%3Cpath d='M50 0L60.2 39.8 100 50 60.2 60.2 50 100 39.8 60.2 0 50 39.8 39.8z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="text-center max-w-lg mx-auto p-8 relative z-10">
          <h3 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-[#0b1b49] to-blue-600 bg-clip-text text-transparent">
            مرحباً بك في نظام المحادثات
          </h3>

          <div className="bg-gradient-to-r from-[#0b1b49]/5 to-blue-500/5 p-4 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-600 font-medium">
              💬 ابدأ محادثة جديدة واستمتع بتجربة تواصل سلسة ومتطورة
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isOnline = selectedUser
    ? onlineUsers.includes(selectedUser._id)
    : false;

  return (
    <div className="flex-1 flex flex-col h-full bg-white/50 backdrop-blur-sm overflow-hidden">
      {/* Chat Header - Fixed */}
      <div className="flex-shrink-0">
        <ChatHeader
          user={selectedUser}
          isOnline={isOnline}
          onBackToConversations={onBackToConversations}
          showBackButton={showBackButton}
          userRole={userRole}
        />
      </div>

      {/* Messages Container - Scrollable */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {isLoading ? (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50/20 to-white/30">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-[#0b1b49]/20 border-t-[#0b1b49] rounded-full animate-spin"></div>
              <Loading text="جاري تحميل الرسائل..." />
            </div>
          </div>
        ) : (
          <MessagesContainer
            messages={messages}
            selectedUser={selectedUser}
            userId={userId}
          />
        )}
      </div>

      {/* Message Input - Fixed */}
      <div className="flex-shrink-0">
        <MessageInput
          message={message}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          onKeyPress={onKeyPress}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default MessageArea;
