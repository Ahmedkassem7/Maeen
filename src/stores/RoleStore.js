import { create } from "zustand";

// Role-based permissions store
const useRoleStore = create((set, get) => ({
  // Define role permissions
  permissions: {
    teacher: {
      canAccessTeacherDashboard: true,
      canAccessTeacherProfile: true,
      canAccessTeacherChat: true,
      canCreateHalaqa: true,
      canManageStudents: true,
      canViewAllEpisodes: true,
      canAccessStudentRoutes: false,
    },
    student: {
      canAccessStudentDashboard: true,
      canAccessStudentProfile: true,
      canAccessStudentChat: true,
      canJoinHalaqa: true,
      canViewProgress: true,
      canAccessTeacherRoutes: false,
    },
  },

  // Check if user has specific permission
  hasPermission: (userType, permission) => {
    const { permissions } = get();
    return permissions[userType]?.[permission] || false;
  },

  // Check if user can access specific route
  canAccessRoute: (userType, route) => {
    const teacherRoutes = [
      "/Teacher",
      "/TeacherProfile",
      "/Teacher/teacher-chat",
    ];
    const studentRoutes = [
      "/Student",
      "/StudentProfile",
      "/Student/student-chat",
    ];

    if (userType === "teacher") {
      return !studentRoutes.some((studentRoute) =>
        route.startsWith(studentRoute)
      );
    }

    if (userType === "student") {
      return !teacherRoutes.some((teacherRoute) =>
        route.startsWith(teacherRoute)
      );
    }

    return false;
  },
}));

export default useRoleStore;
