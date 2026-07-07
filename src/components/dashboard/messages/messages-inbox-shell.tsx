"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon, MessageSquare } from "lucide-react";
import { LeadThreadList, type LeadThreadListItem } from "@/components/dashboard/messages/lead-thread-list";
import { LeadThreadHeader, type LeadThreadHeaderData } from "@/components/dashboard/messages/lead-thread-header";
import { LeadThreadView, type LeadMessageItem } from "@/components/dashboard/messages/lead-thread-view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { SendLeadMessageFn } from "@/components/dashboard/messages/lead-message-composer";

export type MessagesInboxRole = "seller" | "buyer";

const INBOX_COPY: Record<
  MessagesInboxRole,
  {
    emptyThreadDescription: string;
    searchPlaceholder: string;
    emptyListDescription: string;
    replyPlaceholder: string;
    submitLabel: string;
  }
> = {
  seller: {
    emptyThreadDescription: "Choose a buyer thread on the left to read and reply to messages.",
    searchPlaceholder: "Search buyer or aircraft",
    emptyListDescription: "Buyer messages on your listings will appear here.",
    replyPlaceholder: "Write your reply to the buyer",
    submitLabel: "Send reply",
  },
  buyer: {
    emptyThreadDescription: "Choose a listing conversation on the left to continue messaging.",
    searchPlaceholder: "Search aircraft or listing contact",
    emptyListDescription: "Messages you send from aircraft listings will appear here.",
    replyPlaceholder: "Write your message to the listing contact",
    submitLabel: "Send message",
  },
};

interface MessagesInboxShellProps {
  threads: LeadThreadListItem[];
  activeLeadId?: string | null;
  threadHeader?: LeadThreadHeaderData | null;
  messages?: LeadMessageItem[];
  canSendMessage?: boolean;
  baseHref: string;
  inboxRole: MessagesInboxRole;
  onSend: SendLeadMessageFn;
}

export function MessagesInboxShell({
  threads,
  activeLeadId,
  threadHeader,
  messages = [],
  canSendMessage = false,
  baseHref,
  inboxRole,
  onSend,
}: MessagesInboxShellProps) {
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const copy = INBOX_COPY[inboxRole];

  const threadPanel =
    activeLeadId && threadHeader ? (
      <Card className="flex min-h-[32rem] flex-col overflow-hidden shadow-none lg:h-[calc(100dvh-10rem)]">
        <LeadThreadHeader thread={threadHeader} />
        <LeadThreadView
          leadId={activeLeadId}
          messages={messages}
          canSendMessage={canSendMessage}
          onSend={onSend}
          placeholder={copy.replyPlaceholder}
          submitLabel={copy.submitLabel}
        />
      </Card>
    ) : (
      <Card className="flex h-full min-h-[28rem] items-center justify-center shadow-none">
        <Empty className="border-none">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquare />
            </EmptyMedia>
            <EmptyTitle>Select a conversation</EmptyTitle>
            <EmptyDescription>{copy.emptyThreadDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Card>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <Sheet open={mobileListOpen} onOpenChange={setMobileListOpen}>
          <SheetTrigger className="inline-flex">
            <Button variant="outline" size="sm" type="button">
              <MenuIcon data-icon="inline-start" />
              Conversations
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100vw-2rem,22rem)] p-0">
            <SheetHeader className="border-b border-border p-4">
              <SheetTitle>Messages</SheetTitle>
            </SheetHeader>
            <div className="p-2">
              <LeadThreadList
                threads={threads}
                activeLeadId={activeLeadId}
                baseHref={baseHref}
                searchPlaceholder={copy.searchPlaceholder}
                emptyDescription={copy.emptyListDescription}
              />
            </div>
          </SheetContent>
        </Sheet>
        {activeLeadId ? (
          <Button variant="ghost" size="sm" render={<Link href={baseHref} />}>
            All conversations
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <LeadThreadList
            threads={threads}
            activeLeadId={activeLeadId}
            baseHref={baseHref}
            searchPlaceholder={copy.searchPlaceholder}
            emptyDescription={copy.emptyListDescription}
          />
        </div>
        <div className="min-w-0">{threadPanel}</div>
      </div>
    </div>
  );
}
