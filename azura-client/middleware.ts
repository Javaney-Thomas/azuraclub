import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname;

  // Define routes that are public (accessible without authentication)
  const isPublicPath = [
    "/login",
    "/signup",
    "/reset-password",
    "/public",
  ].includes(path);

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value || "";

  // Protected routes that require authentication
  const protectedRoutes = ["/profile", "/dashboard", "/account", "/orders"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // If trying to access a public route while logged in, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If no redirect is needed, continue with the request
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/profile/:path*",
    "/dashboard/:path*",
    "/account/:path*",
    "/orders/:path*",
  ],
};
