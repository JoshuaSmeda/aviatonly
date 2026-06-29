export const ORGANIZATION_TYPES = [
  "SELLER",
  "BROKER",
  "AMO",
  "INSPECTOR",
  "OTHER",
] as const

export type OrganizationType = (typeof ORGANIZATION_TYPES)[number]

export const ORGANIZATION_MEMBER_ROLES = ["owner", "admin", "member"] as const
export type OrganizationMemberRole = (typeof ORGANIZATION_MEMBER_ROLES)[number]

export function formatOrganizationRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  SELLER: "Seller / owner",
  BROKER: "Brokerage",
  AMO: "AMO / maintenance",
  INSPECTOR: "Inspection provider",
  OTHER: "Other",
}

export function formatOrganizationType(type: string): string {
  if (type in ORGANIZATION_TYPE_LABELS) {
    return ORGANIZATION_TYPE_LABELS[type as OrganizationType]
  }
  return type
}

export function slugifyOrganizationName(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "organization"
  )
}

export function getOrganizationInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  const initials = parts.map((part) => part[0]?.toUpperCase() ?? "").join("")
  return initials || "ORG"
}
