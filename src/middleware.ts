import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { isPublicDashboardPath } from "@/lib/auth/navigation"

const AUTH_ROUTES = ["/auth/auth1/login", "/auth/auth1/register", "/auth/auth1/forgot-password"]
const DASHBOARD_PREFIX = "/dashboard"

function withPathnameHeader(request: NextRequest, pathname: string) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", pathname)
  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = getSessionCookie(request)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const isDashboardRoute =
    pathname === DASHBOARD_PREFIX || pathname.startsWith(`${DASHBOARD_PREFIX}/`)
  const isPublicBrowse = isPublicDashboardPath(pathname)

  if (isDashboardRoute && !sessionCookie && !isPublicBrowse) {
    const loginUrl = new URL("/auth/auth1/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard/buy", request.url))
  }

  if (isDashboardRoute || isAuthRoute) {
    return withPathnameHeader(request, pathname)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/auth/auth1/:path*"],
}
