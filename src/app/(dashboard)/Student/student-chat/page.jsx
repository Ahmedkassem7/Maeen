"use client";

import Chat from "../../../_component/chat/Chat";
import { useSearchParams } from "next/navigation";

const StudentChatPage = () => {
  const searchParams = useSearchParams();
  const teacherId = searchParams.get("teacherId");
  return (
    <Chat
      searchPlaceholder="البحث عن معلم..."
      conversationsTitle="محادثات المعلمين"
      initialTeacherId={teacherId}
      userRole="student" // تمرير دور الطالب
    />
  );
};

export default StudentChatPage;
