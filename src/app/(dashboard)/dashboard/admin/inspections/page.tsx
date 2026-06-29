import { Search } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Inspections")

export default function AdminInspectionsPage() {
  return (
    <RoleWorkspacePage
      title="Inspections"
      icon={Search}
      description="Schedule and track AMO or platform inspections before listings are approved for publication."
    />
  )
}
