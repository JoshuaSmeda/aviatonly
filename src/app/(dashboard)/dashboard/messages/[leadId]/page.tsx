import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import { MessagesInboxShell } from "@/components/dashboard/messages/messages-inbox-shell";
import { sendBuyerLeadMessage } from "@/components/dashboard/messages/buyer-message-actions";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { AuthorizationError } from "@/lib/aviatonly/server/authorization";
import {
  getLeadThreadDetail,
  markLeadThreadRead,
  queryLeadMessages,
  queryLeadThreadsForUser,
} from "@/lib/aviatonly/server/lead-messages";
import { requireAuth } from "@/lib/auth/session";

interface BuyerMessageThreadPageProps {
  params: Promise<{ leadId: string }>;
}

const BUYER_MESSAGES_BASE = "/dashboard/messages";

export async function generateMetadata({ params }: BuyerMessageThreadPageProps): Promise<Metadata> {
  const { leadId } = await params;
  return {
    title: `Messages · Lead ${leadId.slice(0, 8)} | AVIATONLY`,
  };
}

const BuyerMessageThreadPage = async ({ params }: BuyerMessageThreadPageProps) => {
  const { leadId } = await params;
  const session = await requireAuth();

  let threadHeader;
  try {
    threadHeader = await getLeadThreadDetail(leadId, session.user.id);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      redirect("/dashboard/messages?error=unauthorized");
    }
    throw error;
  }

  if (!threadHeader) {
    notFound();
  }

  await markLeadThreadRead(leadId, session.user.id);

  const [threads, messages] = await Promise.all([
    queryLeadThreadsForUser(session.user.id, "buyer"),
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
          baseHref={BUYER_MESSAGES_BASE}
          inboxRole="buyer"
          onSend={sendBuyerLeadMessage}
        />
      </TitleCard>
    </>
  );
};

export default BuyerMessageThreadPage;
