import { NextResponse, NextRequest } from "next/server";
import { getCookie } from "./lib/utils";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "./lib/constants";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => {
    if (route.includes("[id]") || route.includes(":path*")) {
      const baseRoute = route.split(/[[]|:/)[0];
      return path.startsWith(baseRoute);
    }
    return path === route;
  });

  const isPublicRoute = PUBLIC_ROUTES.includes(path);

  const token = await getCookie("authToken");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/profile/:path*",
    "/user/:path*",
    "/users/:path*",
    "/actions/:path*",
    "/dashboard/:path*",
  ],
};
