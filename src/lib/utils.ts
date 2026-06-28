import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DASHBOARD_BASE_PATH = "/dashboard"

/**
 * Routes that live outside the dashboard layout (route groups that add no path
 * segment), so they must NOT receive the "/dashboard" prefix.
 */
const NON_DASHBOARD_PREFIXES = ["/auth"]

/**
 * Sidebar/menu URLs are authored relative to the dashboard root (e.g. "/apps/chat").
 * The dashboard is mounted under "/dashboard", so prefix internal links at render time.
 * External links, anchors, auth routes, and already-prefixed paths are left untouched.
 */
export function withDashboardBase(url?: string): string {
  if (!url) return "#"
  if (
    url === "#" ||
    /^https?:\/\//.test(url) ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  ) {
    return url
  }
  if (url === DASHBOARD_BASE_PATH || url.startsWith(`${DASHBOARD_BASE_PATH}/`)) {
    return url
  }
  if (
    NON_DASHBOARD_PREFIXES.some(
      (prefix) => url === prefix || url.startsWith(`${prefix}/`),
    )
  ) {
    return url
  }
  if (url === "/") return DASHBOARD_BASE_PATH
  return `${DASHBOARD_BASE_PATH}${url.startsWith("/") ? "" : "/"}${url}`
}
