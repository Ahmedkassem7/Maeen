// Route definitions and utilities
export const ROUTES = {
  // Public routes
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  COURSES: "/courses",
  FREELANCE: "/freelance",

  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot_password",
  RESET_PASSWORD: "/reset_password",
  VERIFY_OTP: "/verifyOTP",
  CONFIRM_EMAIL: "/confirm_email",

  // Teacher routes
  TEACHER_DASHBOARD: "/Teacher",
  TEACHER_PROFILE: "/TeacherProfile",
  TEACHER_CHAT: "/Teacher/teacher-chat",

  // Student routes
  STUDENT_DASHBOARD: "/Student",
  STUDENT_PROFILE: "/StudentProfile",
  STUDENT_CHAT: "/Student/student-chat",
};

// Role-based route groups
export const ROUTE_GROUPS = {
  PUBLIC: [
    ROUTES.HOME,
    ROUTES.ABOUT,
    ROUTES.CONTACT,
    ROUTES.COURSES,
    ROUTES.FREELANCE,
  ],
  AUTH: [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.VERIFY_OTP,
    ROUTES.CONFIRM_EMAIL,
  ],
  TEACHER_ONLY: [
    ROUTES.TEACHER_DASHBOARD,
    ROUTES.TEACHER_PROFILE,
    ROUTES.TEACHER_CHAT,
  ],
  STUDENT_ONLY: [
    ROUTES.STUDENT_DASHBOARD,
    ROUTES.STUDENT_PROFILE,
    ROUTES.STUDENT_CHAT,
  ],
};

// Check if a route is public
export const isPublicRoute = (pathname) => {
  return (
    ROUTE_GROUPS.PUBLIC.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    ) ||
    ROUTE_GROUPS.AUTH.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  );
};

// Check if a route requires teacher role
export const isTeacherRoute = (pathname) => {
  return ROUTE_GROUPS.TEACHER_ONLY.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
};

// Check if a route requires student role
export const isStudentRoute = (pathname) => {
  return ROUTE_GROUPS.STUDENT_ONLY.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
};

// Get default dashboard route for user type
export const getDefaultDashboard = (userType) => {
  switch (userType) {
    case "teacher":
      return ROUTES.TEACHER_DASHBOARD;
    case "student":
      return ROUTES.STUDENT_DASHBOARD;
    default:
      return ROUTES.HOME;
  }
};

// Check if user can access route
export const canUserAccessRoute = (userType, pathname) => {
  // Public routes are accessible to everyone
  if (isPublicRoute(pathname)) {
    return true;
  }

  // If user is not authenticated, only public routes are allowed
  if (!userType) {
    return false;
  }

  // Teacher accessing student routes
  if (userType === "teacher" && isStudentRoute(pathname)) {
    return false;
  }

  // Student accessing teacher routes
  if (userType === "student" && isTeacherRoute(pathname)) {
    return false;
  }

  return true;
};
