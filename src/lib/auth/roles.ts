export const APP_ROLES = [
  "BUYER",
  "SELLER",
  "BROKER",
  "INSPECTOR",
  "ADMIN",
  "SUPER_ADMIN",
] as const

export type AppRole = (typeof APP_ROLES)[number]

/** Default marketplace capabilities for any signed-up user. */
export const MEMBER_ROLES: AppRole[] = ["BUYER", "SELLER"]

/** Roles that can manage listings, intake, and seller-side CRM. */
export const SELLER_ROLES: AppRole[] = [...MEMBER_ROLES, "BROKER"]
export const ADMIN_ROLES: AppRole[] = ["ADMIN", "SUPER_ADMIN"]
export const INSPECTOR_ROLES: AppRole[] = ["INSPECTOR", "ADMIN", "SUPER_ADMIN"]

export const ALL_AUTHENTICATED_ROLES: AppRole[] = [
  ...MEMBER_ROLES,
  "BROKER",
  "INSPECTOR",
  "ADMIN",
  "SUPER_ADMIN",
]

export function parseRoles(raw: unknown): AppRole[] {
  if (!Array.isArray(raw)) return []
  const parsed = raw.filter(
    (role): role is AppRole =>
      typeof role === "string" && APP_ROLES.includes(role as AppRole),
  )
  return normalizeMemberRoles(parsed)
}

/** BUYER and SELLER are paired capabilities — not mutually exclusive identities. */
export function normalizeMemberRoles(roles: AppRole[]): AppRole[] {
  const normalized = new Set(roles)
  const isMarketplaceMember =
    normalized.has("BUYER") ||
    normalized.has("SELLER") ||
    normalized.has("BROKER")

  if (isMarketplaceMember) {
    normalized.add("BUYER")
    normalized.add("SELLER")
  }

  return APP_ROLES.filter((role) => normalized.has(role))
}

export function hasAnyRole(userRoles: AppRole[], allowed: AppRole[]): boolean {
  if (userRoles.some((role) => role === "SUPER_ADMIN")) return true
  return allowed.some((role) => userRoles.includes(role))
}

export function hasAllRoles(userRoles: AppRole[], required: AppRole[]): boolean {
  return required.every((role) => userRoles.includes(role))
}

export function getUserInitials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  return (email?.slice(0, 2) ?? "U").toUpperCase()
}
