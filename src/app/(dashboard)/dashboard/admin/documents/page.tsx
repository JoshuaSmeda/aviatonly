import { FileText } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Documents")

export default function AdminDocumentsPage() {
  return (
    <RoleWorkspacePage
      title="Documents"
      icon={FileText}
      description="Review private aircraft documents, logbooks, and compliance paperwork before buyer access is granted."
    />
  )
}
