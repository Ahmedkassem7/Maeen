import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { io } from "socket.io-client";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
} from "../lib/token";
import { fetchAllTeachers } from "../Api/freelance";

// Helper function to get user object safely
const getUser = () => {
  if (typeof window !== "undefined") {
    try {
      const auth = JSON.parse(localStorage.getItem("auth-storage"));
      // Return the full user object
      return auth?.state?.user;
    } catch (error) {
      console.error("Error parsing auth storage:", error);
      return null;
    }
  }
  return null;
};

// Debounce hook for search (No changes needed here)
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export const useChat = ({ initialTeacherId } = {}) => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showConversations, setShowConversations] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const socketRef = useRef(null);
  // FIX: Get the full user object, not just the ID
  const user = getUser();
  const userId = user?._id;
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Helper to add a temporary conversation for a new teacher (No changes needed)

  const addTemporaryConversation = (teacherUser) => {
    setConversations((prev) => {
      if (prev.some((conv) => conv.user?._id === teacherUser._id)) return prev;
      return [
        {
          conversationId: `temp-${teacherUser._id}`,
          user: teacherUser,
          lastMessage: null,
          unreadCount: 0,
        },
        ...prev,
      ];
    });
  }; // Memoized filtered conversations (No changes needed)

  const filteredConversations = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return conversations;
    return conversations.filter((conv) => {
      if (!conv.user) return false;
      const searchLower = debouncedSearchQuery.toLowerCase();
      const fullName = `${conv.user.firstName || ""} ${
        conv.user.lastName || ""
      }`.toLowerCase();
      return fullName.includes(searchLower);
    });
  }, [conversations, debouncedSearchQuery]); // Load conversations with error handling (No changes needed)

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchConversations();
      const convs = Array.isArray(data) ? data : data.conversations || [];
      convs.sort(
        (a, b) =>
          new Date(b.lastMessage?.createdAt || 0) -
          new Date(a.lastMessage?.createdAt || 0)
      );
      setConversations(convs);
      const unreadObj = {};
      convs.forEach((conv) => {
        if (conv.user?._id && typeof conv.unreadCount === "number") {
          unreadObj[conv.user._id] = conv.unreadCount;
        }
      });
      setUnreadCounts(unreadObj);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]); // Corrected useEffect for selecting the initial teacher (No changes needed)

  useEffect(() => {
    if (!initialTeacherId || loading || selectedUser) return;
    const selectInitialTeacher = () => {
      const existingConv = conversations.find(
        (c) => c.user?._id === initialTeacherId
      );
      if (existingConv) {
        setSelectedUser(existingConv.user);
        return;
      }
      fetchAllTeachers({ _id: initialTeacherId })
        .then((response) => {
          const teacher = response?.data?.teachers?.[0];
          if (teacher?.user) {
            addTemporaryConversation(teacher.user);
            setSelectedUser(teacher.user);
          }
        })
        .catch((err) => console.error("Error fetching teacher:", err));
    };
    selectInitialTeacher();
  }, [initialTeacherId, conversations, loading]); // Load messages when user is selected (No changes needed)

  useEffect(() => {
    if (selectedUser?._id) {
      setMessagesLoading(true);
      fetchMessages(selectedUser._id)
        .then(setMessages)
        .catch(() => setMessages([]))
        .finally(() => setMessagesLoading(false));
    } else {
      setMessages([]);
    }
  }, [selectedUser]); // Socket.io connection and event handling (No changes needed)

  useEffect(() => {
    if (!userId) return;

    const socket = io("https://backend-ui4w.onrender.com", {
      path: "/chat",
      query: { userId },
    });
    socketRef.current = socket;

    socket.on("connect", () => setConnectionStatus("connected"));
    socket.on("disconnect", () => setConnectionStatus("disconnected"));
    socket.on("connect_error", (err) =>
      console.error("Socket connection error:", err)
    );

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId?._id === userId) return;

      const sender = newMessage.senderId;
      setConversations((prevConvs) => {
        const convIndex = prevConvs.findIndex(
          (c) => c.user?._id === sender._id
        );
        if (convIndex > -1) {
          const updatedConv = {
            ...prevConvs[convIndex],
            lastMessage: newMessage,
          };
          const restConvs = prevConvs.filter((c) => c.user?._id !== sender._id);
          return [updatedConv, ...restConvs];
        } else {
          const newConv = {
            conversationId: newMessage.conversation,
            user: sender,
            lastMessage: newMessage,
            unreadCount: 1,
          };
          return [newConv, ...prevConvs];
        }
      });

      if (selectedUser?._id === sender._id) {
        setMessages((prev) => [...prev, newMessage]);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [sender._id]: (prev[sender._id] || 0) + 1,
        }));
      }
    });

    socket.on("getOnlineUsers", setOnlineUsers);

    return () => {
      socket.disconnect();
    };
  }, [userId, selectedUser]); // Responsive effect (No changes needed)

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setShowConversations(isMobile ? !selectedUser : true);
      setShowMessages(isMobile ? !!selectedUser : true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedUser]); // LOGIC FIX: Correctly construct the message object for the sender's UI

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser?._id) return;

    try {
      // The API call returns the saved message from the database.
      const sentMsgFromServer = await sendMessage(selectedUser._id, message);

      // PROBLEM: The `sentMsgFromServer` object has `senderId` as a string ID,
      // which causes the message bubble to render on the wrong side.
      // SOLUTION: We manually construct a new object for the UI with the full `user` object.
      const messageForUI = {
        ...sentMsgFromServer,
        senderId: user, // Use the full user object from our auth store.
      };

      // Add the correctly structured message to the SENDER's UI immediately.
      setMessages((prev) => [...prev, messageForUI]);

      // Update the SENDER's conversation list immediately using the correct object.
      setConversations((prev) => {
        const convIndex = prev.findIndex(
          (c) => c.user?._id === selectedUser._id
        );

        if (convIndex > -1) {
          const updatedConv = {
            ...prev[convIndex],
            lastMessage: messageForUI,
            conversationId: sentMsgFromServer.conversation,
          };
          const restConvs = prev.filter(
            (c) => c.user?._id !== selectedUser._id
          );
          return [updatedConv, ...restConvs].sort(
            (a, b) =>
              new Date(b.lastMessage?.createdAt || 0) -
              new Date(a.lastMessage?.createdAt || 0)
          );
        }

        const newConv = {
          conversationId: sentMsgFromServer.conversation,
          user: selectedUser,
          lastMessage: messageForUI,
          unreadCount: 0,
        };
        return [newConv, ...prev];
      });

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setUnreadCounts((prev) => ({ ...prev, [user._id]: 0 }));
    await markMessagesAsRead(user._id);
  };

  const handleBackToConversations = () => {
    setSelectedUser(null);
  };

  return {
    // State
    conversations,
    selectedUser,
    messages,
    message,
    searchQuery,
    onlineUsers,
    unreadCounts,
    loading,
    messagesLoading,
    showConversations,
    showMessages,
    filteredConversations,
    userId,
    connectionStatus, // Actions
    setMessage,
    setSearchQuery,
    handleSendMessage,
    handleKeyPress,
    handleSelectUser,
    handleBackToConversations,
    refreshConversations: loadConversations,
  };
};
