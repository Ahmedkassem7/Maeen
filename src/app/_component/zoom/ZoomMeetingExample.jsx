import React from "react";
import ZoomMeetingCDN from "./ZoomMeet";

/**
 * Example usage of ZoomMeetingCDN component
 * This shows how to integrate Zoom meetings with episode data
 */
const ZoomMeetingExample = () => {
  // Example episode data
  const sampleEpisode = {
    id: 1,
    name: "حلقة المبتدئين",
    meetingId: "74193049671",
    meetingPassword: "lsuv1966",
  };

  // Example user data
  const sampleUser = {
    firstName: "Sayed",
    lastName: "Mohamed",
    role: "teacher", // or "student"
  };

  const handleMeetingEnd = () => {
    console.log("Meeting ended");
    // Handle what happens when meeting ends
    // e.g., redirect to dashboard, show feedback form, etc.
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ZoomMeetingCDN
        meetingNumber={sampleEpisode.meetingId}
        meetingPassword={sampleEpisode.meetingPassword}
        userName={`${sampleUser.firstName} ${sampleUser.lastName}`}
        userRole={sampleUser.role === "teacher" ? 1 : 0}
        onMeetingEnd={handleMeetingEnd}
      />
    </div>
  );
};

export default ZoomMeetingExample;
