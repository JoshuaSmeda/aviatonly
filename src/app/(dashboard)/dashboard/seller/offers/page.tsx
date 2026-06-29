import { HandCoins } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Offers")

export default function SellerOffersPage() {
  return (
    <RoleWorkspacePage
      title="Offers"
      icon={HandCoins}
      description="Review incoming offers, counters, and acceptance decisions on your listings."
    />
  )
}
