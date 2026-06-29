import { FolderLock } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Document Vault")

export default function SellerDocumentsPage() {
  return (
    <RoleWorkspacePage
      title="Document Vault"
      icon={FolderLock}
      description="Manage private logbooks, certificates, and compliance documents for your aircraft listings."
    />
  )
}
