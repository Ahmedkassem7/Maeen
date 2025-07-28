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
    return formatDistanceToNow(messageTime, { addSuffix: true, locale: ar });
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
      <div
        className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1 group`}
      >
        {" "}
        <div
          className={`
        max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%]
        px-3 py-2
        rounded-2xl relative
        shadow-md hover:shadow-lg
        transition-all duration-300
        transform hover:scale-[1.01]
        word-wrap break-words overflow-wrap break-word
        ${
          isOwn
            ? `bg-gradient-to-br from-[#0b1b49] via-[#1e3a8a] to-[#0b1b49] 
               text-white shadow-[#0b1b49]/20
               ${isLastInGroup ? "rounded-br-md" : "rounded-br-2xl"}`
            : `bg-white border border-gray-200 text-gray-800 shadow-gray-200/50
               ${isLastInGroup ? "rounded-bl-md" : "rounded-bl-2xl"}`
        }
   
        ${
          isOwn
            ? "before:bg-gradient-to-br before:from-white/5 before:to-transparent"
            : "before:bg-gradient-to-br before:from-blue-50/50 before:to-transparent"
        }
    
      `}
        >
          {" "}
          {/* Glow effect for own messages */}{" "}
          {isOwn && (
            <div className="absolute -inset-1 bg-gradient-to-r from-[#0b1b49] via-[#1e3a8a] to-[#0b1b49] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
          )}{" "}
          {/* Message content */}{" "}
          <div className="relative z-10">
            {" "}
            <p
              className={`
            text-sm leading-relaxed break-words overflow-wrap break-word hyphens-auto font-arabic
            ${isOwn ? "text-white" : "text-gray-800"}
          `}
              style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
            >
              {message}
            </p>{" "}
            {/* Time and status */}{" "}
            <div
              className={`            flex items-center justify-end gap-1 mt-1 text-xs            ${
                isOwn ? "text-blue-100" : "text-gray-500"
              }          `}
            >
              {" "}
              <span className="font-arabic">
                {" "}
                {formatMessageTime(timestamp)}{" "}
              </span>{" "}
              {/* Status indicators for own messages */}{" "}
              {isOwn && (
                <div className="flex items-center gap-0.5">
                  {" "}
                  <div
                    className={`w-3 h-3 rounded-full border transition-colors duration-200 ${
                      isRead
                        ? "bg-green-400 border-green-300"
                        : isDelivered
                        ? "bg-blue-400 border-blue-300"
                        : "bg-gray-400 border-gray-300"
                    }`}
                  >
                    {" "}
                    {isRead && (
                      <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1"></div>
                    )}{" "}
                  </div>{" "}
                </div>
              )}{" "}
            </div>{" "}
          </div>{" "}
          {/* Tail for message bubble */}{" "}
          {isLastInGroup && (
            <div
              className={`            absolute bottom-0 w-3 h-3 transform rotate-45`}
            ></div>
          )}{" "}
          {/* Shimmer effect on hover */}{" "}
          <div
            className={`          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500          bg-gradient-to-r from-transparent via-white/10 to-transparent          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000        `}
          ></div>{" "}
        </div>{" "}
      </div>
    );
  }
);
MessageBubble.displayName = "MessageBubble";
export default MessageBubble;
