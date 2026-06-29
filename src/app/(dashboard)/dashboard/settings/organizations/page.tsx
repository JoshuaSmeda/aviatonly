import type { Metadata } from "next"
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp"
import OrganizationsSettingIndex from "@/components/dashboard/theme-pages/organizations-settings"
import { requireAuth } from "@/lib/auth/session"

export const metadata: Metadata = {
  title: "Organizations | AVIATONLY",
}

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Organizations",
  },
]

export default async function OrganizationsPage() {
  await requireAuth()

  return (
    <>
      <BreadcrumbComp title="Organizations" items={BCrumb} />
      <OrganizationsSettingIndex />
    </>
  )
}
