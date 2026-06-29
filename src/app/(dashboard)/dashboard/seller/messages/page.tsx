import { MessageSquare } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Messages")

export default function SellerMessagesPage() {
  return (
    <RoleWorkspacePage
      title="Messages"
      icon={MessageSquare}
      description="Buyer and AVIATONLY operations messages for your active listings and deals."
    />
  )
}
