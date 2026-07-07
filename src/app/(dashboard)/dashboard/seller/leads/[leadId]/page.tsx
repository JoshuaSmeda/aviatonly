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
import { requireAuth } from "@/lib/auth/session";

interface SellerLeadDetailPageProps {
  params: Promise<{ leadId: string }>;
}

export async function generateMetadata({ params }: SellerLeadDetailPageProps): Promise<Metadata> {
  const { leadId } = await params;
  const lead = await getLeadWorkspace(leadId, "/dashboard/seller/leads");
  return {
    title: lead
      ? `Lead · ${lead.listing.registration} | AVIATONLY`
      : "Lead | AVIATONLY",
  };
}

const SellerLeadDetailPage = async ({ params }: SellerLeadDetailPageProps) => {
  const { leadId } = await params;
  const session = await requireAuth();
  const lead = await getLeadWorkspace(leadId, "/dashboard/seller/leads");

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
    redirect("/dashboard/seller/leads?error=unauthorized");
  }

  const canManage = canManageLead(
    { sellerId: lead.seller.id, assignedToId: lead.assignee?.id ?? null },
    session,
  );

  const messageContext = await loadLeadWorkspaceMessageContext({
    leadId,
    viewerId: session.user.id,
    canManage,
    markRead: true,
  });

  return (
    <>
      <ListingWorkspacePageHeader
        backHref="/dashboard/seller/leads"
        backLabel="Sales pipeline"
        eyebrow="Lead workspace"
        title={`${lead.buyer.name} · ${lead.listing.registration}`}
      />
      <LeadWorkspace
        lead={lead}
        canManage={canManage}
        backHref="/dashboard/seller/leads"
        messageContext={messageContext}
      />
    </>
  );
};

export default SellerLeadDetailPage;
