"use client";

import Chat from "../../../_component/chat/Chat";

const TeacherChatPage = () => {
  return (
    <Chat
      searchPlaceholder="البحث عن طالب..."
      conversationsTitle="محادثات الطلاب"
      userRole="teacher" // تمرير دور المعلم
    />
  );
};

export default TeacherChatPage;
