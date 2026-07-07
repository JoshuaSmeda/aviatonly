import { requireAuth } from "@/lib/auth/session"

export default async function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await requireAuth()
  return children
}
