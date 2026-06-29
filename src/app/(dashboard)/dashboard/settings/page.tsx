import { Settings } from "lucide-react"
import {
  RoleWorkspacePage,
  createRoleWorkspaceMetadata,
} from "@/components/dashboard/shared/role-workspace-page"
import { requireAuth } from "@/lib/auth/session"

export const metadata = createRoleWorkspaceMetadata("Settings")

export default async function SettingsPage() {
  await requireAuth()

  return (
    <RoleWorkspacePage
      title="Settings"
      icon={Settings}
      description="Account preferences, notification settings, and profile details for your AVIATONLY workspace."
    />
  )
}
