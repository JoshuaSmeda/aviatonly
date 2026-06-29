import { redirect } from "next/navigation"
import DashboardShell from "./dashboard-shell"
import { getSession } from "@/lib/auth/session"
import { buildNavigationForRoles } from "@/lib/auth/navigation"

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  if (!session) {
    redirect("/auth/auth1/login")
  }

  const navigation = buildNavigationForRoles(session.user.roles)

  return (
    <DashboardShell navigation={navigation} user={session.user}>
      {children}
    </DashboardShell>
  )
}
