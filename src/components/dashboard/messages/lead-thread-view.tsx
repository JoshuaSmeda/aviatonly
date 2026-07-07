"use client";

import { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  LeadMessageComposer,
  type SendLeadMessageFn,
} from "@/components/dashboard/messages/lead-message-composer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface LeadMessageItem {
  id: string;
  senderName: string;
  body: string;
  createdAt: string;
  isOwnMessage: boolean;
}

interface LeadThreadViewProps {
  leadId: string;
  messages: LeadMessageItem[];
  canSendMessage: boolean;
  onSend: SendLeadMessageFn;
  replyLabel?: string;
  placeholder?: string;
  submitLabel?: string;
  onMessageSent?: () => void;
  compact?: boolean;
}

function scrollMessagesToBottom(anchor: HTMLElement | null) {
  if (!anchor) return;

  const viewport = anchor.closest('[data-slot="scroll-area-viewport"]');
  if (viewport instanceof HTMLElement) {
    viewport.scrollTop = viewport.scrollHeight;
    return;
  }

  anchor.scrollIntoView({ block: "end" });
}

export function LeadThreadView({
  leadId,
  messages,
  canSendMessage,
  onSend,
  replyLabel,
  placeholder,
  submitLabel,
  onMessageSent,
  compact = false,
}: LeadThreadViewProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      scrollMessagesToBottom(messagesEndRef.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [messages]);

  return (
    <div
      className={cn(
        "flex flex-col",
        compact ? "h-[min(36rem,50dvh)]" : "min-h-[32rem] flex-1",
      )}
    >
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-4 p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages in this thread yet.</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex max-w-[85%] flex-col gap-1",
                  message.isOwnMessage ? "ml-auto items-end" : "items-start",
                )}
              >
                <p className="text-xs font-medium text-muted-foreground">{message.senderName}</p>
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    message.isOwnMessage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {message.body}
                </div>
                <time className="text-xs text-muted-foreground" dateTime={message.createdAt}>
                  {format(new Date(message.createdAt), "dd MMM yyyy · HH:mm")}
                </time>
              </div>
            ))
          )}
          <div ref={messagesEndRef} aria-hidden className="h-px shrink-0" />
        </div>
      </ScrollArea>

      <LeadMessageComposer
        leadId={leadId}
        onSend={onSend}
        disabled={!canSendMessage}
        replyLabel={replyLabel}
        placeholder={placeholder}
        submitLabel={submitLabel}
        onSent={() => {
          onMessageSent?.();
          router.refresh();
        }}
      />
    </div>
  );
}
