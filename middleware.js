import { NextResponse } from "next/server";
import {
  isPublicRoute,
  isTeacherRoute,
  isStudentRoute,
  getDefaultDashboard,
} from "./src/utils/routes";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get auth data from cookies or headers
  const authCookie = request.cookies.get("auth-storage");
  let isAuthenticated = false;
  let userType = null;

  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie.value);
      isAuthenticated = authData.state?.isAuthenticated || false;
      userType = authData.state?.user?.userType || null;

      // Additional validation - if we have a cookie but no user data, consider it invalid
      if (authData.state?.isAuthenticated && !authData.state?.user) {
        isAuthenticated = false;
        userType = null;
      }
    } catch (error) {
      console.error("Error parsing auth cookie:", error);
      isAuthenticated = false;
      userType = null;
    }
  }

  // If it's a public route, allow access
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!isAuthenticated || !userType) {
    // Redirect to login for protected routes
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access for authenticated users
  if (isAuthenticated && userType) {
    // Teacher trying to access student routes
    if (userType === "teacher" && isStudentRoute(pathname)) {
      return NextResponse.redirect(new URL("/Teacher", request.url));
    }

    // Student trying to access teacher routes
    if (userType === "student" && isTeacherRoute(pathname)) {
      return NextResponse.redirect(new URL("/Student", request.url));
    }

    // Redirect to appropriate dashboard if accessing root while authenticated
    if (pathname === "/") {
      const dashboardUrl = getDefaultDashboard(userType);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
