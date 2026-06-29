import { ADMIN_ROLES, SELLER_ROLES } from "@/lib/auth/roles"
import { requireAnyRole } from "@/lib/auth/session"

const SELLER_WORKSPACE_ROLES = [...SELLER_ROLES, ...ADMIN_ROLES]

export default async function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await requireAnyRole(SELLER_WORKSPACE_ROLES)
  return children
}
