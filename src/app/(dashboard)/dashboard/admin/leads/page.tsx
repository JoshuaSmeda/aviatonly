import { UsersRound } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Leads")

export default function AdminLeadsPage() {
  return (
    <RoleWorkspacePage
      title="Leads"
      icon={UsersRound}
      description="Monitor buyer enquiries and qualification status across live listings."
    />
  )
}
