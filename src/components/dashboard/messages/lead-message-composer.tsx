"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export type SendLeadMessageResult =
  | { ok: true; leadId: string }
  | { ok: false; error: string };

export type SendLeadMessageFn = (
  leadId: string,
  body: string,
) => Promise<SendLeadMessageResult>;

interface LeadMessageComposerProps {
  leadId: string;
  onSend: SendLeadMessageFn;
  disabled?: boolean;
  disabledReason?: string;
  replyLabel?: string;
  placeholder?: string;
  submitLabel?: string;
  onSent?: () => void;
}

export function LeadMessageComposer({
  leadId,
  onSend,
  disabled = false,
  disabledReason,
  replyLabel = "Reply",
  placeholder = "Write your message",
  submitLabel = "Send message",
  onSent,
}: LeadMessageComposerProps) {
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim() || disabled) return;

    startTransition(async () => {
      const result = await onSend(leadId, body);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setBody("");
      toast.success("Message sent");
      onSent?.();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border-t border-border p-4">
      {disabled ? (
        <p className="text-sm text-muted-foreground">
          {disabledReason ?? "This conversation is closed and cannot accept new messages."}
        </p>
      ) : (
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`message-${leadId}`}>{replyLabel}</FieldLabel>
            <Textarea
              id={`message-${leadId}`}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={3}
              placeholder={placeholder}
              disabled={isPending}
              required
            />
          </Field>
        </FieldGroup>
      )}
      {!disabled ? (
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? <Spinner data-icon="inline-start" /> : null}
          {submitLabel}
        </Button>
      ) : null}
    </form>
  );
}
