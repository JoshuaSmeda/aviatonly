import { HandCoins } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Offers")

export default function AdminOffersPage() {
  return (
    <RoleWorkspacePage
      title="Offers"
      icon={HandCoins}
      description="Review fixed-price offers, counters, and acceptance decisions across active deals."
    />
  )
}
