import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import LeadWorkspace from "@/components/dashboard/leads/lead-workspace";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import {
  assertCanAccessLead,
  canManageLead,
} from "@/lib/aviatonly/server/authorization";
import { getLeadWorkspace } from "@/lib/aviatonly/server/lead-workspace";
import { requireAnyRole } from "@/lib/auth/session";
import { ADMIN_ROLES } from "@/lib/auth/roles";

interface AdminLeadDetailPageProps {
  params: Promise<{ leadId: string }>;
}

export async function generateMetadata({ params }: AdminLeadDetailPageProps): Promise<Metadata> {
  const { leadId } = await params;
  const lead = await getLeadWorkspace(leadId, "/dashboard/admin/leads");
  return {
    title: lead
      ? `Admin · ${lead.listing.registration} Lead | AVIATONLY`
      : "Lead | AVIATONLY Admin",
  };
}

const AdminLeadDetailPage = async ({ params }: AdminLeadDetailPageProps) => {
  const { leadId } = await params;
  const session = await requireAnyRole(ADMIN_ROLES);
  const lead = await getLeadWorkspace(leadId, "/dashboard/admin/leads");

  if (!lead) {
    notFound();
  }

  try {
    assertCanAccessLead(
      {
        buyerId: lead.buyer.id,
        sellerId: lead.seller.id,
        assignedToId: lead.assignee?.id ?? null,
      },
      session,
    );
  } catch {
    redirect("/dashboard/admin/leads?error=unauthorized");
  }

  const canManage = canManageLead(
    { sellerId: lead.seller.id, assignedToId: lead.assignee?.id ?? null },
    session,
  );

  return (
    <>
      <BreadcrumbComp title={`Admin · ${lead.listing.registration}`} />
      <TitleCard title={`${lead.seller.name} · ${lead.listing.registration}`}>
        <p className="mb-4 text-sm text-muted-foreground">
          Cross-listing lead review for {lead.buyer.name} ({lead.buyer.email}).
        </p>
        <LeadWorkspace
          lead={lead}
          canManage={canManage}
          backHref="/dashboard/admin/leads"
        />
      </TitleCard>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link href="/dashboard/admin/leads" className="hover:underline">
          Back to admin leads queue
        </Link>
      </p>
    </>
  );
};

export default AdminLeadDetailPage;
