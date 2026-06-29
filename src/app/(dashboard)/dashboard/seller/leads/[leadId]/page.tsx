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

  return (
    <>
      <BreadcrumbComp title={`${lead.listing.registration} · Lead`} />
      <TitleCard>
        <LeadWorkspace
          lead={lead}
          canManage={canManage}
          backHref="/dashboard/seller/leads"
        />
      </TitleCard>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link href="/dashboard/seller/leads" className="hover:underline">
          Back to all leads
        </Link>
      </p>
    </>
  );
};

export default SellerLeadDetailPage;
