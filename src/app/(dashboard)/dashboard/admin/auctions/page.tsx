import { Gavel } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Auctions")

export default function AdminAuctionsPage() {
  return (
    <RoleWorkspacePage
      title="Auctions"
      icon={Gavel}
      description="Configure timed auctions, monitor bidding activity, and manage reserve outcomes."
    />
  )
}
