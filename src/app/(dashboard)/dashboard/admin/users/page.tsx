import { Users } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Users")

export default function AdminUsersPage() {
  return (
    <RoleWorkspacePage
      title="Users"
      icon={Users}
      description="Manage buyer, seller, broker, inspector, and admin accounts with role assignments."
    />
  )
}
