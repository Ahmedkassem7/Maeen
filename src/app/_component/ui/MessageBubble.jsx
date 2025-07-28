import { memo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

const formatMessageTime = (timestamp) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInHours = (now - messageTime) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return messageTime.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInHours < 48) {
    return "أمس";
  } else {
    return formatDistanceToNow(messageTime, {
      addSuffix: true,
      locale: ar,
    });
  }
};

const MessageBubble = memo(
  ({
    message,
    isOwn,
    timestamp,
    isDelivered = false,
    isRead = false,
    isLastInGroup = true,
  }) => {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1`}>
        <div
          className={`
        max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
        px-4 py-2
        rounded-2xl
        shadow-sm
        transition-all duration-200
        hover:shadow-md
        ${
          isOwn
            ? "bg-gradient-to-r from-[#0b1b49] to-[#0b1b49]/90 text-white rounded-br-md"
            : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
        }
        ${isLastInGroup ? "mb-2" : ""}
      `}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message}
          </p>

          <div
            className={`
          flex items-center justify-between mt-2 text-xs gap-2
          ${isOwn ? "text-blue-100" : "text-gray-500"}
        `}
          >
            <span className="shrink-0">{formatMessageTime(timestamp)}</span>

            {isOwn && (
              <div className="flex items-center gap-1 shrink-0">
                {isRead ? (
                  <div className="flex">
                    <div className="w-2 h-2 rounded-full bg-green-400 -mr-1"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                ) : isDelivered ? (
                  <div className="flex">
                    <div className="w-2 h-2 rounded-full bg-blue-300 -mr-1"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
