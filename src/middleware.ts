import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const AUTH_ROUTES = ["/auth/auth1/login", "/auth/auth1/register", "/auth/auth1/forgot-password"]
const DASHBOARD_PREFIX = "/dashboard"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = getSessionCookie(request)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const isDashboardRoute =
    pathname === DASHBOARD_PREFIX || pathname.startsWith(`${DASHBOARD_PREFIX}/`)

  if (isDashboardRoute && !sessionCookie) {
    const loginUrl = new URL("/auth/auth1/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL(DASHBOARD_PREFIX, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/auth1/:path*"],
}
