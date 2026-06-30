import { ADMIN_ROLES } from "@/lib/auth/roles";
import { requireAnyRole } from "@/lib/auth/session";

export default async function AuctionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAnyRole(ADMIN_ROLES);
  return children;
}
