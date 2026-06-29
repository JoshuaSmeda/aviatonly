import { LayoutDashboard } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Admin Dashboard")

export default function AdminDashboardPage() {
  return (
    <RoleWorkspacePage
      title="Admin Dashboard"
      icon={LayoutDashboard}
      description="Operations overview for review queues, listings, valuations, inspections, and deal progression."
    />
  )
}
