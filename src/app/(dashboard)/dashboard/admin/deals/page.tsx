import { Handshake } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Deals")

export default function AdminDealsPage() {
  return (
    <RoleWorkspacePage
      title="Deals"
      icon={Handshake}
      description="Track deposits, contracts, SACAA transfer steps, and funds release across active transactions."
    />
  )
}
