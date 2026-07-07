import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import LeadWorkspace from "@/components/dashboard/leads/lead-workspace";
import ListingWorkspacePageHeader from "@/components/dashboard/listings/listing-workspace-page-header";
import {
  assertCanAccessLead,
  canManageLead,
} from "@/lib/aviatonly/server/authorization";
import { getLeadWorkspace } from "@/lib/aviatonly/server/lead-workspace";
import { loadLeadWorkspaceMessageContext } from "@/lib/aviatonly/server/lead-workspace-messages";
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

  const messageContext = await loadLeadWorkspaceMessageContext({
    leadId,
    viewerId: session.user.id,
    canManage: false,
    isAdmin: true,
  });

  return (
    <>
      <ListingWorkspacePageHeader
        backHref="/dashboard/admin/leads"
        backLabel="Leads queue"
        eyebrow="Admin · Lead review"
        title={`${lead.buyer.name} · ${lead.listing.registration}`}
      />
      <LeadWorkspace lead={lead} canManage={canManage} messageContext={messageContext} />
    </>
  );
};

export default AdminLeadDetailPage;
