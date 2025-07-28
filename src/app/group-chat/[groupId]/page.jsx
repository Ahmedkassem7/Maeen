"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { io } from "socket.io-client";
import GroupChatMessageBubble from "../../group-chat/[groupId]/GroupChatMessageBubble";
import GroupChatInput from "../../group-chat/[groupId]/GroupChatInput";
import GroupChatSidebar from "./GroupChatSidebar";
import useAuthStore from "../../../stores/AuthStore";
import useStudentHalakatStore from "../../../stores/StudentHalakatStore";

const API_BASE = "https://backend-ui4w.onrender.com/api/v1/chat/group";
const SOCKET_SERVER_URL = "https://backend-ui4w.onrender.com";

const GroupChatPage = () => {
  const { groupId } = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const fetchHalakaDetailsById = useStudentHalakatStore((state) => state.fetchHalakaDetailsById);

  const [halakaDetails, setHalakaDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null); // Use a ref to hold the socket instance

  // Effect for fetching initial data
  useEffect(() => {
    if (!groupId || !token) return;
    setLoading(true);

    const fetchInitialData = async () => {
      try {
        // Fetch group info to get halakaId
        const groupRes = await axios.get(`${API_BASE}/${groupId}`, { headers: { Authorization: `Bearer ${token}` } });
        const halakaId = groupRes.data.halaka || groupRes.data.halaka?._id;
        if (halakaId) {
          const detailsRes = await fetchHalakaDetailsById(halakaId, token);
          setHalakaDetails(detailsRes.data);
        }
        
        // Fetch messages
        const messagesRes = await axios.get(`${API_BASE}/${groupId}/messages`, { headers: { Authorization: `Bearer ${token}` } });
        setMessages(messagesRes.data);

      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [groupId, token, fetchHalakaDetailsById]);

  // Effect for managing the socket connection
  useEffect(() => {
    if (!user?._id || !groupId) return;

    // Connect to the socket server
    socketRef.current = io(SOCKET_SERVER_URL, {
      path: "/chat",
      query: { userId: user._id },
    });
    const socket = socketRef.current;

    // Handler for new messages from the socket
    const handleNewMessage = (data) => {
      if (data && data.message && data.groupId === groupId) {
        const actualMessage = data.message;
        setMessages((prevMessages) => {
          // Safeguard to prevent duplicates
          if (prevMessages.some((m) => m._id === actualMessage._id)) {
            return prevMessages;
          }
          return [...prevMessages, actualMessage];
        });
      }
    };
    socket.on("groupMessage", handleNewMessage);

    // Listen for online users
    const handleOnlineUsers = (userIds) => {
      setOnlineUsers(userIds);
    };
    socket.on("getOnlineUsers", handleOnlineUsers);

    // Cleanup function on component unmount
    return () => {
      socket.off("groupMessage", handleNewMessage);
      socket.off("getOnlineUsers", handleOnlineUsers);
      socket.disconnect();
    };
  }, [user?._id, groupId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // LOGIC FIX: Removed optimistic UI to prevent duplicate messages
  const handleSend = async (text) => {
    if (!text.trim() || sending) return;
    setSending(true);

    try {
      // We only send the request to the server.
      // The UI will update ONLY when the message arrives via the socket.
      await axios.post(
        `${API_BASE}/${groupId}/message`,
        { message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally show an error toast to the user
    } finally {
      setSending(false);
    }
  };

  // Prepare data for the sidebar
  const teacher = halakaDetails?.teacher;
  const students = halakaDetails?.students || [];
  const currentStudent = students.find((s) => s.userId?._id === user?._id);
  const otherStudents = students.filter((s) => s.userId?._id !== user?._id);

  // الهيدر
  const renderHeader = () => (
    <div className="flex items-center justify-between gap-4 p-4 py-5 bg-white rounded-t-xl shadow-lg z-10" dir="rtl">
      <div className="flex items-center gap-1">
        <div className="md:hidden bg-white border-b border-gray-100">
          <button className="text-2xl cursor-pointer text-blue-900 p-2" onClick={() => setShowSidebar(true)} title="عرض المشاركين">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75" /></svg>
        </div>
        <div>
          <div className="font-bold text-lg text-[#0b1b49]">{halakaDetails?.title || halakaDetails?.name || "دورة تطوير المواقع الشاملة"}</div>
          <div className="text-gray-500 text-xs mt-1">{halakaDetails?.description || "دورة تطوير المواقع الشاملة"}</div>
        </div>
      </div>
      </div>
      <button
        onClick={() => router.back()}
        className="px-4 py-2 cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 text-gray-700 transition hover:shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
    </div>
  );

  return (
    <div className="flex h-[90vh] bg-[#f8fafc] rounded-xl overflow-hidden shadow-lg relative" dir="rtl">
      {/* Sidebar - ثابت في الشاشات الكبيرة */}
      <div className="hidden md:block h-full w-85 bg-white border-l border-gray-100 sticky top-0 shadow-lg">
        <GroupChatSidebar teacher={teacher} currentStudent={currentStudent} students={otherStudents} onlineUsers={onlineUsers} />
      </div>
      {/* Sidebar Overlay للموبايل */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* خلفية شفافة لإغلاق السايدبار */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowSidebar(false)}></div>
          <div className="relative w-64 max-w-[80vw] h-full bg-white shadow-lg z-50 animate-slideInRight">
            <button className="absolute top-2 left-2 text-gray-600 hover:text-red-600 text-2xl" onClick={() => setShowSidebar(false)} title="إغلاق">
              &times;
            </button>
            <GroupChatSidebar teacher={teacher} currentStudent={currentStudent} students={otherStudents} onlineUsers={onlineUsers} />
          </div>
        </div>
      )}
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        {/* زر فتح السايدبار في الموبايل */}
        
        {renderHeader()}
        <div className="flex-1 flex flex-col px-0 md:px-0">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">جاري التحميل...</div>
          ) : (
            <div className="flex-1 flex flex-col py-4 px-8 bg-transparent overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(80vh - 120px)' }}>
              {messages.length === 0 && (
                <div className="text-center text-gray-400 my-8">لا توجد رسائل بعد</div>
              )}
              {messages.map((msg) => (
                <GroupChatMessageBubble
                  key={msg._id}
                  message={msg}
                  isOwn={msg.senderId?._id === user?._id}
                  isTeacher={msg.senderId?._id === teacher?._id}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div className="p-2 md:p-4 bg-white border-t border-gray-100">
          <GroupChatInput onSend={handleSend} loading={sending} />
        </div>
      </div>
    </div>
  );
};

export default GroupChatPage; 