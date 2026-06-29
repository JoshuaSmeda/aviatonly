export const APP_ROLES = [
  "BUYER",
  "SELLER",
  "BROKER",
  "INSPECTOR",
  "ADMIN",
  "SUPER_ADMIN",
] as const

export type AppRole = (typeof APP_ROLES)[number]

export const SELLER_ROLES: AppRole[] = ["SELLER", "BROKER"]
export const ADMIN_ROLES: AppRole[] = ["ADMIN", "SUPER_ADMIN"]
export const INSPECTOR_ROLES: AppRole[] = ["INSPECTOR", "ADMIN", "SUPER_ADMIN"]

export function parseRoles(raw: unknown): AppRole[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((role): role is AppRole =>
    typeof role === "string" && APP_ROLES.includes(role as AppRole),
  )
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
