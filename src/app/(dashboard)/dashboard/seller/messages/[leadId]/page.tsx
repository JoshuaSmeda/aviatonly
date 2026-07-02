import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import { MessagesInboxShell } from "@/components/dashboard/messages/messages-inbox-shell";
import { sendSellerLeadMessage } from "@/components/dashboard/messages/seller-message-actions";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { AuthorizationError } from "@/lib/aviatonly/server/authorization";
import {
  getLeadThreadDetail,
  markLeadThreadRead,
  queryLeadMessages,
  queryLeadThreadsForUser,
} from "@/lib/aviatonly/server/lead-messages";
import { requireAnyRole } from "@/lib/auth/session";
import { ADMIN_ROLES, SELLER_ROLES } from "@/lib/auth/roles";

interface SellerMessageThreadPageProps {
  params: Promise<{ leadId: string }>;
}

const SELLER_MESSAGES_BASE = "/dashboard/seller/messages";

export async function generateMetadata({ params }: SellerMessageThreadPageProps): Promise<Metadata> {
  const { leadId } = await params;
  return {
    title: `Messages · Lead ${leadId.slice(0, 8)} | AVIATONLY`,
  };
}

const SellerMessageThreadPage = async ({ params }: SellerMessageThreadPageProps) => {
  const { leadId } = await params;
  const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);

  let threadHeader;
  try {
    threadHeader = await getLeadThreadDetail(leadId, session.user.id);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      redirect("/dashboard/seller/messages?error=unauthorized");
    }
    throw error;
  }

  if (!threadHeader) {
    notFound();
  }

  await markLeadThreadRead(leadId, session.user.id);

  const [threads, messages] = await Promise.all([
    queryLeadThreadsForUser(session.user.id, "seller"),
    queryLeadMessages(leadId, session.user.id),
  ]);

  return (
    <>
      <BreadcrumbComp title={`Messages · ${threadHeader.registration}`} />
      <TitleCard>
        <MessagesInboxShell
          threads={threads}
          activeLeadId={leadId}
          threadHeader={threadHeader}
          messages={messages}
          canSendMessage={threadHeader.canSendMessage}
          baseHref={SELLER_MESSAGES_BASE}
          inboxRole="seller"
          onSend={sendSellerLeadMessage}
        />
      </TitleCard>
    </>
  );
};

export default SellerMessageThreadPage;
