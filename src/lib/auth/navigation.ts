import type { ChildItem, MenuItem } from "@/app/(dashboard)/dashboard/layout/vertical/sidebar/sidebaritems"
import { type AppRole, hasAnyRole } from "@/lib/auth/roles"

export type NavMenuItem = ChildItem & {
  roles: AppRole[]
}

export type NavSection = {
  heading: string
  roles: AppRole[]
  items: NavMenuItem[]
}

const ALL_AUTHENTICATED: AppRole[] = [
  "BUYER",
  "SELLER",
  "BROKER",
  "INSPECTOR",
  "ADMIN",
  "SUPER_ADMIN",
]

const SELLER_ACCESS: AppRole[] = ["SELLER", "BROKER", "ADMIN", "SUPER_ADMIN"]
const ADMIN_ACCESS: AppRole[] = ["ADMIN", "SUPER_ADMIN"]

export const AVIATONLY_NAV_SECTIONS: NavSection[] = [
  {
    heading: "Seller",
    roles: SELLER_ACCESS,
    items: [
      {
        name: "Dashboard",
        icon: "solar:widget-5-line-duotone",
        url: "/",
        roles: SELLER_ACCESS,
      },
      {
        name: "My Aircraft",
        icon: "solar:clipboard-list-line-duotone",
        url: "/listings",
        roles: SELLER_ACCESS,
      },
      {
        name: "Create Listing",
        icon: "solar:jet-line-duotone",
        url: "/seller/upload",
        roles: SELLER_ACCESS,
      },
      {
        name: "Leads",
        icon: "solar:users-group-rounded-line-duotone",
        url: "/seller/leads",
        roles: SELLER_ACCESS,
      },
      {
        name: "Offers",
        icon: "solar:hand-money-line-duotone",
        url: "/seller/offers",
        roles: SELLER_ACCESS,
      },
      {
        name: "Deals",
        icon: "solar:wallet-money-line-duotone",
        url: "/escrow-tracker",
        roles: SELLER_ACCESS,
      },
      {
        name: "Document Vault",
        icon: "solar:folder-with-files-line-duotone",
        url: "/seller/documents",
        roles: SELLER_ACCESS,
      },
      {
        name: "Messages",
        icon: "solar:chat-round-line-line-duotone",
        url: "/seller/messages",
        roles: SELLER_ACCESS,
      },
      {
        name: "Billing",
        icon: "solar:card-line-duotone",
        url: "/seller/billing",
        roles: SELLER_ACCESS,
      },
      {
        name: "Settings",
        icon: "solar:settings-line-duotone",
        url: "/settings",
        roles: SELLER_ACCESS,
      },
      {
        name: "Organizations",
        icon: "solar:buildings-2-line-duotone",
        url: "/settings/organizations",
        roles: SELLER_ACCESS,
      },
    ],
  },
  {
    heading: "Administration",
    roles: ADMIN_ACCESS,
    items: [
      {
        name: "Dashboard",
        icon: "solar:chart-square-line-duotone",
        url: "/admin",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Review Queue",
        icon: "solar:clipboard-check-line-duotone",
        url: "/admin/review-queue",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Listings",
        icon: "solar:clipboard-list-line-duotone",
        url: "/admin/listings",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Users",
        icon: "solar:user-id-line-duotone",
        url: "/admin/users",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Documents",
        icon: "solar:document-text-line-duotone",
        url: "/admin/documents",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Valuations",
        icon: "solar:calculator-line-duotone",
        url: "/admin/valuations",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Inspections",
        icon: "solar:magnifer-line-duotone",
        url: "/admin/inspections",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Leads",
        icon: "solar:users-group-rounded-line-duotone",
        url: "/admin/leads",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Offers",
        icon: "solar:hand-money-line-duotone",
        url: "/admin/offers",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Deals",
        icon: "solar:wallet-money-line-duotone",
        url: "/admin/deals",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Auctions",
        icon: "solar:hammer-line-duotone",
        url: "/admin/auctions",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Reports",
        icon: "solar:graph-new-line-duotone",
        url: "/admin/reports",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Settings",
        icon: "solar:settings-line-duotone",
        url: "/settings",
        roles: ADMIN_ACCESS,
      },
      {
        name: "Organizations",
        icon: "solar:buildings-2-line-duotone",
        url: "/settings/organizations",
        roles: ADMIN_ACCESS,
      },
    ],
  },
  {
    heading: "Marketplace",
    roles: ALL_AUTHENTICATED,
    items: [
      {
        name: "Browse Aircraft",
        icon: "solar:magnifer-line-duotone",
        url: "/buy",
        external: true,
        roles: ALL_AUTHENTICATED,
      },
    ],
  },
]

export function buildNavigationForRoles(userRoles: AppRole[]): MenuItem[] {
  return AVIATONLY_NAV_SECTIONS.filter((section) =>
    hasAnyRole(userRoles, section.roles),
  ).map((section) => ({
    heading: section.heading,
    items: section.items
      .filter((item) => hasAnyRole(userRoles, item.roles))
      .map(({ roles: _roles, ...item }) => item),
  }))
}

export function canAccessDashboardPath(
  pathname: string,
  userRoles: AppRole[],
): boolean {
  const normalized = pathname.replace(/^\/dashboard/, "") || "/"

  for (const section of AVIATONLY_NAV_SECTIONS) {
    for (const item of section.items) {
      if (!item.url || item.external) continue
      const itemPath = item.url === "/" ? "/" : item.url
      const matches =
        normalized === itemPath ||
        (itemPath !== "/" && normalized.startsWith(`${itemPath}/`))

      if (matches) {
        return hasAnyRole(userRoles, item.roles)
      }
    }
  }

  if (
    normalized === "/settings" ||
    normalized.startsWith("/settings/")
  ) {
    return hasAnyRole(userRoles, ALL_AUTHENTICATED)
  }

  return hasAnyRole(userRoles, ALL_AUTHENTICATED)
}
