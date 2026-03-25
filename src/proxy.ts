import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  // const token =
  //   req.cookies.get("authjs.session-token") ??
  //   req.cookies.get("__Secure-authjs.session-token");
  // const isAuthenticated = !!token;
  // const isPublicRoute =
  //   req.nextUrl.pathname.startsWith("/auth") ||
  //   req.nextUrl.pathname.startsWith("/lernen") ||
  //   req.nextUrl.pathname.startsWith("/start");
  // if (!isAuthenticated && !isPublicRoute) {
  //   return NextResponse.redirect(new URL("/auth", req.url));
  // }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
