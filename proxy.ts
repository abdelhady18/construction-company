import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { NextAuthRequest } from "next-auth/lib";

export default auth((req: NextAuthRequest) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage && !req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const rawCookie = req.headers.get("cookie") || "";
  const hasLocaleCookie = /NEXT_LOCALE=/.test(rawCookie);

  const response = NextResponse.next();
  if (!hasLocaleCookie) {
    const acceptLang = req.headers.get("Accept-Language") || "";
    const locale = acceptLang.startsWith("ar") ? "ar" : "en";
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
  }

  return response;
});

export const config = {
  matcher: ["/", "/admin/:path*", "/api/upload/:path*"],
};
