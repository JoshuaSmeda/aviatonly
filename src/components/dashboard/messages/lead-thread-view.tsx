"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  LeadMessageComposer,
  type SendLeadMessageFn,
} from "@/components/dashboard/messages/lead-message-composer";
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

  return (
    <div className={cn("flex flex-1 flex-col", compact ? "min-h-[16rem]" : "min-h-[28rem]")}>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
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
      </div>

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
