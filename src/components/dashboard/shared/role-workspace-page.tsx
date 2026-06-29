import type { Metadata } from "next"
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp"
import TitleCard from "@/components/dashboard/shared/titleborder-card"
import WorkflowPlaceholder from "@/components/dashboard/shared/workflow-placeholder"
import type { LucideIcon } from "lucide-react"

interface RoleWorkspacePageProps {
  title: string
  description: string
  icon: LucideIcon
}

export function createRoleWorkspaceMetadata(title: string): Metadata {
  return { title: `${title} | AVIATONLY` }
}

export function RoleWorkspacePage({
  title,
  description,
  icon: Icon,
}: RoleWorkspacePageProps) {
  return (
    <>
      <BreadcrumbComp title={title} />
      <TitleCard title={title}>
        <WorkflowPlaceholder icon={Icon} title={title} description={description} />
      </TitleCard>
    </>
  )
}
