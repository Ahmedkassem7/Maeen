import React from "react";

const GroupChatMessageBubble = ({ message, isOwn, isTeacher }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3 w-full`} dir="rtl">
      {!isOwn && (
        <img
          src={message.senderId?.profilePicture || "/default-profile.jpg"}
          alt={message.senderId?.firstName}
          className="w-8 h-8 rounded-full mr-2 border border-gray-200"
        />
      )}
      <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm flex flex-col ${isOwn ? "bg-[#0b1b49] text-white rounded-br-md" : "bg-white text-gray-900 border border-gray-200"}`} style={{direction: 'rtl'}}>
        <div className="flex items-center gap-1 mb-1">
          <span className={`text-xs font-bold ${isTeacher ? 'text-blue-700' : isOwn ? 'text-white' : 'text-gray-700'}`}>{message.senderId?.firstName} {message.senderId?.lastName}</span>
          {isTeacher && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.286 7.037a1 1 0 00.95.69h7.396c.969 0 1.371 1.24.588 1.81l-5.99 4.356a1 1 0 00-.364 1.118l2.287 7.036c.3.921-.755 1.688-1.54 1.118l-5.99-4.356a1 1 0 00-1.176 0l-5.99 4.356c-.784.57-1.838-.197-1.54-1.118l2.287-7.036a1 1 0 00-.364-1.118L2.03 12.464c-.783-.57-.38-1.81.588-1.81h7.396a1 1 0 00.95-.69l2.286-7.037z" /></svg>
          )}
          {isOwn && <span className="text-[10px] bg-white/20 rounded px-1 ml-1">(أنت)</span>}
        </div>
        <div className="text-sm break-words">{message.message}</div>
        <div className={`text-[10px] mt-1 text-left ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
      </div>
      {isOwn && (
        <img
          src={message.senderId?.profilePicture || "/default-profile.jpg"}
          alt={message.senderId?.firstName}
          className="w-8 h-8 rounded-full ml-2 border border-gray-200"
        />
      )}
    </div>
  );
};

export default GroupChatMessageBubble; 