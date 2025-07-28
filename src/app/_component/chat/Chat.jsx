import { useChat } from "../../hooks/useChat";
import ConversationsList from "./ConversationsList_new";
import MessageArea from "./MessageArea";
import { memo, Suspense } from "react";
import Loading from "@/app/_component/shared/loading/Loading";
import "./chat-styles.css";

const Chat = memo(
  ({
    searchPlaceholder = "البحث عن مستخدم...",
    conversationsTitle = "المحادثات النشطة",
    initialTeacherId,
    userRole = "student", // إضافة دور المستخدم
  }) => {
    const {
      // State
      selectedUser,
      messages,
      message,
      searchQuery,
      onlineUsers,
      unreadCounts,
      loading,
      showConversations,
      showMessages,
      filteredConversations,
      userId,

      // Actions
      setMessage,
      setSearchQuery,
      handleSendMessage,
      handleKeyPress,
      handleSelectUser,
      handleBackToConversations,
      refreshConversations, // Add refresh function
    } = useChat({ initialTeacherId });

    return (
      <div
        className="relative w-full  mx-auto h-[calc(100vh-85px)] bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 overflow-hidden rounded-2xl shadow-2xl border border-gray-200/50"
        dir="rtl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Mobile Header */}
        <div className="md:hidden bg-gradient-to-r from-[#0b1b49] via-[#1e3a8a] to-[#0b1b49] text-white shadow-xl border-b border-white/10">
          <div className="px-3 py-3">
            <h1 className="text-base font-bold text-center bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {conversationsTitle}
            </h1>
          </div>
        </div>

        <div className="flex h-[calc(100%-50px)] md:h-full relative overflow-hidden">
          {/* Conversations List */}
          {showConversations && (
            <div className="w-full md:w-80 flex-shrink-0 relative z-10 overflow-hidden">
              <Suspense
                fallback={<Loading message="جاري تحميل المحادثات..." />}
              >
                <ConversationsList
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  loading={loading}
                  filteredConversations={filteredConversations}
                  selectedUser={selectedUser}
                  onlineUsers={onlineUsers}
                  unreadCounts={unreadCounts}
                  onSelectUser={handleSelectUser}
                  searchPlaceholder={searchPlaceholder}
                  title={conversationsTitle}
                  onRefresh={refreshConversations}
                />
              </Suspense>
            </div>
          )}

          {/* Message Area */}
          {showMessages && (
            <div className="flex-1 min-w-0 relative overflow-hidden">
              <Suspense fallback={<Loading message="جاري تحميل الرسائل..." />}>
                <MessageArea
                  selectedUser={selectedUser}
                  messages={messages}
                  message={message}
                  onlineUsers={onlineUsers}
                  userId={userId}
                  onSendMessage={handleSendMessage}
                  onMessageChange={setMessage}
                  onKeyPress={handleKeyPress}
                  onBackToConversations={handleBackToConversations}
                  showBackButton={true}
                  isLoading={loading && selectedUser}
                  userRole={userRole}
                />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Chat.displayName = "Chat";

export default Chat;
