import { BarChart3 } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Reports")

export default function AdminReportsPage() {
  return (
    <RoleWorkspacePage
      title="Reports"
      icon={BarChart3}
      description="Operational reporting for listings, leads, offers, deals, and marketplace performance."
    />
  )
}
