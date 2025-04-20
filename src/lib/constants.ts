export const PROTECTED_ROUTES = [
  "/",
  "/profile",
  "/user/[id]",
  "/users",
  "/actions",
  "/actions/:path*",
  "/dashboard",
  "/dashboard/:path*",
];

export const PUBLIC_ROUTES = ["/login", "/register"];

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://reqres.in/api";
