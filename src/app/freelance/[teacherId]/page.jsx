"use client";

import { useState } from "react";
import { Card, CardContent } from "../../_component/ui/Card";
import { Button } from "../../_component/ui/Button";
import { Badge } from "../../_component/ui/Badge";
import { Send, Plus, User, CheckCircle } from "lucide-react";
import { useParams } from "react-router-dom";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "teacher",
      text: "السلام عليكم ورحمة الله وبركاته، أهلاً وسهلاً بك",
      time: "10:30 ص",
      read: true,
    },
    {
      id: 2,
      sender: "student",
      text: "وعليكم السلام، أريد أن أبدأ في حفظ القرآن الكريم",
      time: "10:32 ص",
      read: true,
    },
    {
      id: 3,
      sender: "teacher",
      text: "ممتاز! هل لديك أي خبرة سابقة في الحفظ؟ وما هو مستواك في التجويد؟",
      time: "10:33 ص",
      read: true,
    },
    {
      id: 4,
      sender: "student",
      text: "أعرف القراءة لكن التجويد محتاج تحسين، وحفظت بعض السور القصيرة فقط",
      time: "10:35 ص",
      read: true,
    },
    {
      id: 5,
      sender: "teacher",
      text: "ممتاز، يمكننا البدء بتحسين التجويد أولاً ثم الانتقال للحفظ. ما رأيك أن ننشئ حلقة خاصة بيننا؟",
      time: "10:37 ص",
      read: false,
    },
  ]);

  const teacher = {
    name: "أحمد حسن",
    status: "متصل الآن",
    specialization: "حفظ القرآن وأحكام التجويد",
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "student",
        text: message,
        time: new Date().toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        read: false,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-3" dir="rtl">
      <div className="flex flex-col h-[calc(100vh-80px)]">
        <div className="p-4 bg-gradient-to-r from-islamic-blue to-islamic-green">
          <Card className="bg-white/95 backdrop-blur-sm border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-islamic-blue rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-islamic-blue">
                      {teacher.name}
                    </h3>
                    <p className="text-gray-600">{teacher.specialization}</p>
                    <Badge className="bg-green-100 text-green-700 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
                      متصل الآن
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "student" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender === "student"
                      ? "bg-islamic-blue text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div
                    className={`flex items-center justify-between mt-2 text-xs ${
                      msg.sender === "student"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    <span>{msg.time}</span>
                    {msg.sender === "student" && (
                      <CheckCircle
                        className={`h-3 w-3 ${
                          msg.read ? "text-blue-200" : "text-blue-300"
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors font-arabic text-right bg-white shadow-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-islamic-light"
                >
                  <Plus className="h-4 w-4 text-islamic-blue" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                className="bg-islamic-blue hover:bg-islamic-blue/90 text-white rounded-full p-3"
                disabled={!message.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
