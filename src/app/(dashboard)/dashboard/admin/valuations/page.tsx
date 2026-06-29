import { Calculator } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Valuations")

export default function AdminValuationsPage() {
  return (
    <RoleWorkspacePage
      title="Valuations"
      icon={Calculator}
      description="Record internal valuation estimates and prepare sellers for fixed-price or auction publication."
    />
  )
}
