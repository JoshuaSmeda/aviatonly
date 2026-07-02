"use client";

import Link from "next/link";
import { LeadThreadView, type LeadMessageItem } from "@/components/dashboard/messages/lead-thread-view";
import { sendSellerLeadMessage } from "@/components/dashboard/messages/seller-message-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LeadWorkspaceMessagesProps {
  leadId: string;
  messages: LeadMessageItem[];
  canSendMessage: boolean;
  canReply: boolean;
  inboxHref: string;
}

const LeadWorkspaceMessages = ({
  leadId,
  messages,
  canSendMessage,
  canReply,
  inboxHref,
}: LeadWorkspaceMessagesProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <CardTitle className="text-base">Messages</CardTitle>
        <Button variant="outline" size="sm" render={<Link href={inboxHref} />}>
          Open in inbox
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <LeadThreadView
          leadId={leadId}
          messages={messages}
          canSendMessage={canSendMessage && canReply}
          onSend={sendSellerLeadMessage}
          placeholder="Write your reply to the buyer"
          submitLabel="Send reply"
          compact
        />
      </CardContent>
    </Card>
  );
};

export default LeadWorkspaceMessages;
