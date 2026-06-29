import { ClipboardList } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Listings")

export default function AdminListingsPage() {
  return (
    <RoleWorkspacePage
      title="Listings"
      icon={ClipboardList}
      description="Review and manage all aircraft listings across the AVIATONLY marketplace."
    />
  )
}
