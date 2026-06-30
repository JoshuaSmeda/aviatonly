import { headers } from "next/headers"
import { redirect } from "next/navigation"
import DashboardShell from "./dashboard-shell"
import { getSession } from "@/lib/auth/session"
import {
  buildNavigationForRoles,
  buildPublicNavigation,
  isPublicDashboardPath,
} from "@/lib/auth/navigation"

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

  const navigation = session
    ? buildNavigationForRoles(session.user.roles)
    : buildPublicNavigation()

  return (
    <DashboardShell navigation={navigation} user={session?.user ?? null}>
      {children}
    </DashboardShell>
  )
}
