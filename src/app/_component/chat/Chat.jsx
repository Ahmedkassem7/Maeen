import { useChat } from "../../hooks/useChat";
import ConversationsList from "./ConversationsList_new";
import MessageArea from "./MessageArea";
import { memo } from "react";

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
        className="bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-hidden custom-scrollbar"
        dir="rtl"
      >
        {/* Mobile Header */}
        <div className="md:hidden bg-gradient-to-r from-islamic-blue to-islamic-blue/90 text-white shadow-lg">
          <h1 className="text-xl font-bold text-center">
            {conversationsTitle}
          </h1>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Conversations List */}
          {showConversations && (
            <div className="w-full md:w-auto flex-shrink-0">
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
                onRefresh={refreshConversations} // Add refresh prop
              />
            </div>
          )}

          {/* Message Area */}
          {showMessages && (
            <div className="flex-1 min-w-0">
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
                userRole={userRole} // تمرير دور المستخدم
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

Chat.displayName = "Chat";

export default Chat;
