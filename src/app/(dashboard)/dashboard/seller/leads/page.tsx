import { UsersRound } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Leads")

export default function SellerLeadsPage() {
  return (
    <RoleWorkspacePage
      title="Leads"
      icon={UsersRound}
      description="Track buyer enquiries, viewing requests, and qualification status for your aircraft."
    />
  )
}
