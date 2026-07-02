import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import { MessagesInboxShell } from "@/components/dashboard/messages/messages-inbox-shell";
import { sendSellerLeadMessage } from "@/components/dashboard/messages/seller-message-actions";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import { queryLeadThreadsForUser } from "@/lib/aviatonly/server/lead-messages";
import { requireAnyRole } from "@/lib/auth/session";
import { ADMIN_ROLES, SELLER_ROLES } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "Messages | AVIATONLY",
};

const SELLER_MESSAGES_BASE = "/dashboard/seller/messages";

const SellerMessagesPage = async () => {
  const session = await requireAnyRole([...SELLER_ROLES, "BROKER", ...ADMIN_ROLES]);
  const threads = await queryLeadThreadsForUser(session.user.id, "seller");
  const unreadCount = threads.filter((thread) => thread.unread).length;

  return (
    <>
      <BreadcrumbComp title="Messages" />
      <TitleCard>
        <div className="mb-4 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">
            {threads.length > 0 ? (
              <>
                {threads.length} buyer conversation{threads.length === 1 ? "" : "s"}
                {unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
              </>
            ) : (
              "Buyer messages on your listings will appear here when enquiries are submitted."
            )}
          </p>
        </div>
        <MessagesInboxShell
          threads={threads}
          baseHref={SELLER_MESSAGES_BASE}
          inboxRole="seller"
          onSend={sendSellerLeadMessage}
        />
      </TitleCard>
    </>
  );
};

export default SellerMessagesPage;
