import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
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
}

export const config = {
  matcher: ["/", "/admin/:path*", "/api/upload/:path*"],
};
