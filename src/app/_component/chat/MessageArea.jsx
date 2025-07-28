import {
  Send,
  User,
  MessageCircle,
  ArrowRight,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Plus,
} from "lucide-react";
import { Button } from "../ui/Button";
// import { LoadingSpinner } from "../ui/Loading";
import Avatar from "../ui/Avatar";
import MessageBubble from "../ui/MessageBubble";
import { memo, useRef, useEffect } from "react";
import AddHalaqaModal from "../AddHalaqa/AddHalaqaModal";
import Loading from "@/app/_component/shared/loading/Loading";

const ChatHeader = memo(
  ({ user, isOnline, onBackToConversations, showBackButton, userRole }) => {
    // فحص وجود user
    if (!user) {
      return (
        <div className="bg-white border-b border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-center">
            <p className="text-gray-500">جاري تحميل معلومات المستخدم...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border-b border-gray-200 shadow-sm">
        {/* Back button for mobile */}
        {showBackButton && (
          <div className="md:hidden flex items-center p-3 border-b border-gray-100 bg-gray-50">
            <Button variant="ghost" size="icon" onClick={onBackToConversations}>
              <ArrowRight className="h-5 w-5" />
            </Button>
            <span className="mr-3 font-semibold text-[#0b1b49]">
              الرجوع للمحادثات
            </span>
          </div>
        )}

        {/* Main header */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                user={user}
                size="lg"
                isOnline={isOnline}
                showRole={true}
              />
              <div>
                <h3 className="font-bold text-[#0b1b49] text-lg">
                  {user.firstName} {user.lastName}
                </h3>
                <p
                  className={`text-sm ${
                    isOnline ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {isOnline ? "متصل الآن" : "غير متصل"}
                </p>
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
              {console.log(user)}
              {/* <Button
              variant="ghost"
              size="icon"
              className="text-[#0b1b49] hover:bg-[#0b1b49]/10"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#0b1b49] hover:bg-[#0b1b49]/10"
            >
              <Video className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#0b1b49] hover:bg-[#0b1b49]/10"
            >
              <MoreVertical className="h-5 w-5" />
            </Button> */}
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            ابدأ المحادثة
          </h3>
          <p className="text-gray-500">أرسل أول رسالة لبدء الحوار</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-blue-50/30 to-white">
      <div className="p-6 space-y-2 max-w-4xl mx-auto">
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
  }) => (
    <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        {/* Attachment button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-islamic-blue"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="اكتب رسالتك هنا..."
            disabled={disabled}
            className="
            w-full pr-12 pl-4 py-3 
            border-2 border-gray-200 rounded-2xl 
            focus:border-[#0b1b49] focus:outline-none 
            transition-all duration-300 font-arabic text-right 
            bg-gray-50 focus:bg-white shadow-sm
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          />
          {/* Emoji button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0b1b49]"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        {/* Send button */}
        <Button
          onClick={onSendMessage}
          disabled={!message.trim() || disabled}
          className="
          bg-gradient-to-r from-[#0b1b49] to-[#0b1b49]/90 
          hover:from-[#0b1b49]/90 hover:to-[#0b1b49] 
          text-white rounded-full p-3 shadow-lg
          transition-all duration-300 transform hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        "
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
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
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#0b1b49] to-[#0b1b49]/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <MessageCircle className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            مرحباً بك في نظام المحادثات
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            اختر محادثة من القائمة على اليمين لبدء الدردشة والتواصل
          </p>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">
              💬 ابدأ محادثة جديدة واستمتع بتجربة تواصل سلسة
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isOnline = selectedUser
    ? onlineUsers.includes(selectedUser._id)
    : false;

  // Handler لإضافة حلقة جديدة
  const handleAddHalaqa = () => {
    if (!selectedUser) return;
    // يمكن إضافة منطق إضافة الحلقة هنا
    console.log("إضافة حلقة جديدة مع الطالب:", selectedUser.firstName);
    // يمكن فتح modal أو الانتقال لصفحة إضافة حلقة
    window.open(
      `/Teacher?addHalaqa=true&studentId=${selectedUser._id}`,
      "_blank"
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white md:h-full overflow-y-auto custom-scrollbar">
      {/* Chat Header */}
      <ChatHeader
        user={selectedUser}
        isOnline={isOnline}
        onBackToConversations={onBackToConversations}
        showBackButton={showBackButton}
        userRole={userRole}
        onAddHalaqa={handleAddHalaqa}
      />

      {/* Messages Container */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="flex flex-col items-center gap-4">
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

      {/* Message Input */}
      <MessageInput
        message={message}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onKeyPress={onKeyPress}
        disabled={isLoading}
      />
    </div>
  );
};

export default MessageArea;
