import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import { MessagesInboxShell } from "@/components/dashboard/messages/messages-inbox-shell";
import { sendBuyerLeadMessage } from "@/components/dashboard/messages/buyer-message-actions";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { queryLeadThreadsForUser } from "@/lib/aviatonly/server/lead-messages";
import { requireAuth } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Messages | AVIATONLY",
};

const BUYER_MESSAGES_BASE = "/dashboard/messages";

const BuyerMessagesPage = async () => {
  const session = await requireAuth();
  const threads = await queryLeadThreadsForUser(session.user.id, "buyer");
  const unreadCount = threads.filter((thread) => thread.unread).length;

  return (
    <>
      <BreadcrumbComp title="Messages" />
      <TitleCard>
        <div className="mb-4 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">
            {threads.length > 0 ? (
              <>
                {threads.length} listing conversation{threads.length === 1 ? "" : "s"}
                {unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
              </>
            ) : (
              "Messages you send from aircraft listings will appear here."
            )}
          </p>
        </div>
        <MessagesInboxShell
          threads={threads}
          baseHref={BUYER_MESSAGES_BASE}
          inboxRole="buyer"
          onSend={sendBuyerLeadMessage}
        />
      </TitleCard>
    </>
  );
};

export default BuyerMessagesPage;
