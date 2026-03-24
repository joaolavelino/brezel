import { auth } from "@/auth";

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

  if (!isAuthenticated && !isAuthPage) {
    return Response.redirect(new URL("/auth", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth|lernen|start).*)",
  ],
};
