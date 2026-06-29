import { CreditCard } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"

export const metadata = createRoleWorkspaceMetadata("Billing")

export default function SellerBillingPage() {
  return (
    <RoleWorkspacePage
      title="Billing"
      icon={CreditCard}
      description="Commission statements, featured listing packages, and seller billing history."
    />
  )
}
