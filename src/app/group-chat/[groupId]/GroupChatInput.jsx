import React, { useState } from "react";

const GroupChatInput = ({ onSend, loading }) => {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      setValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 shadow-sm">
      <input
        type="text"
        className="flex-1 border-none outline-none bg-transparent px-4 py-4 text-gray-900 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition w-full"
        placeholder="اكتب رسالتك هنا..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <button
        onClick={handleSend}
        disabled={loading || !value.trim()}
        className="w-10 h-10 flex items-center justify-center bg-[#0b1b49] hover:bg-blue-900 text-white rounded-full transition shadow disabled:opacity-60 disabled:cursor-not-allowed"
        title="إرسال"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-6 9 6-9 6-9-6zm0 0v6a9 9 0 009 9 9 9 0 009-9v-6" /></svg>
      </button>
    </div>
  );
};

export default GroupChatInput; 