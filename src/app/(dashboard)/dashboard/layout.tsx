import { headers } from "next/headers"
import { redirect } from "next/navigation"
import DashboardShell from "./dashboard-shell"
import { getSession } from "@/lib/auth/session"
import { hasAnyRole, SELLER_ROLES, ADMIN_ROLES } from "@/lib/auth/roles"
import {
  buildNavigationForRoles,
  buildPublicNavigation,
  isPublicDashboardPath,
} from "@/lib/auth/navigation"
import { countUnreadLeadThreadsForUser } from "@/lib/aviatonly/server/lead-messages"

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = (await headers()).get("x-pathname") ?? ""
  const session = await getSession()
  const isPublicBrowse = isPublicDashboardPath(pathname)

  if (!session && !isPublicBrowse) {
    redirect("/auth/auth1/login")
  }

  let sellerUnreadMessages: number | undefined
  let buyerUnreadMessages: number | undefined

  if (session) {
    if (hasAnyRole(session.user.roles, [...SELLER_ROLES, "BROKER", ...ADMIN_ROLES])) {
      sellerUnreadMessages = await countUnreadLeadThreadsForUser(session.user.id, "seller")
    }
    buyerUnreadMessages = await countUnreadLeadThreadsForUser(session.user.id, "buyer")
  }

  const navigation = session
    ? buildNavigationForRoles(session.user.roles, {
        sellerUnreadMessages,
        buyerUnreadMessages,
      })
    : buildPublicNavigation()

  return (
    <DashboardShell navigation={navigation} user={session?.user ?? null}>
      {children}
    </DashboardShell>
  )
}
