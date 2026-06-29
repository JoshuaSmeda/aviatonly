"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  addLeadNoteAction,
  closeLeadAction,
  denyLeadDocAccessAction,
  grantLeadDocAccessAction,
  logLeadBuyerResponseAction,
  markLeadContactedAction,
  qualifyLeadAction,
  scheduleLeadViewingAction,
  setLeadFollowUpAction,
  transitionLeadStatusAction,
  unqualifyLeadAction,
} from "@/app/(dashboard)/dashboard/seller/leads/actions";
import LeadFollowUpPicker from "@/components/dashboard/leads/lead-follow-up-picker";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  canTransitionLeadStatus,
  getLeadTypeMeta,
  isTerminalLeadStatus,
  LeadStatus,
  LeadType,
} from "@/lib/aviatonly/domain";
import type { LeadWorkspaceView } from "@/lib/aviatonly/server/lead-workspace-types";

interface LeadWorkspaceActionsProps {
  lead: LeadWorkspaceView;
  canManage: boolean;
}

const LeadWorkspaceActions = ({ lead, canManage }: LeadWorkspaceActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const [responseChannel, setResponseChannel] = useState<"EMAIL" | "CALL">("EMAIL");
  const [responseMessage, setResponseMessage] = useState("");
  const [note, setNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(
    lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt) : undefined,
  );
  const [viewingNote, setViewingNote] = useState("");
  const [closeReason, setCloseReason] = useState("");
  const [unqualifyReason, setUnqualifyReason] = useState("");
  const [docNote, setDocNote] = useState("");

  if (!canManage) {
    return (
      <p className="text-sm text-muted-foreground">
        You can view this lead but cannot take seller actions.
      </p>
    );
  }

  if (isTerminalLeadStatus(lead.status)) {
    return (
      <p className="text-sm text-muted-foreground">
        This lead is closed. No further workflow actions are available.
        {lead.closedReason ? (
          <>
            <br />
            <span className="mt-2 block font-medium text-foreground">
              Reason: {lead.closedReason}
            </span>
          </>
        ) : null}
      </p>
    );
  }

  const run = (action: () => Promise<{ ok: boolean; error?: string }>, success: string) => {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error ?? "Action failed.");
        return;
      }
      toast.success(success);
      setNote("");
      setResponseMessage("");
      setCloseReason("");
      setUnqualifyReason("");
      setViewingNote("");
      setDocNote("");
    });
  };

  const canContact = canTransitionLeadStatus(lead.status, LeadStatus.CONTACTED);
  const canQualify = canTransitionLeadStatus(lead.status, LeadStatus.QUALIFIED);
  const canUnqualify = canTransitionLeadStatus(lead.status, LeadStatus.UNQUALIFIED);
  const canViewing = canTransitionLeadStatus(lead.status, LeadStatus.VIEWING_REQUESTED);
  const canOfferMade = canTransitionLeadStatus(lead.status, LeadStatus.OFFER_MADE);
  const canClose = canTransitionLeadStatus(lead.status, LeadStatus.CLOSED);
  const isDocRequest = lead.type === LeadType.DOCUMENT_ACCESS;

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Respond to buyer</FieldLabel>
          <FieldDescription>
            Log what you told the buyer by email or phone. This appears on the activity timeline.
            In-app messaging is coming later — for now, record your response here after contacting
            them outside the platform.
          </FieldDescription>
          <Select
            value={responseChannel}
            onValueChange={(value) => {
              if (value === "EMAIL" || value === "CALL") setResponseChannel(value);
            }}
          >
            <SelectTrigger className="w-full" aria-label="Response channel">
              <SelectValue placeholder="How did you respond?" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="CALL">Phone call</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Textarea
            rows={4}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            placeholder="Summarise your reply to the buyer's enquiry…"
            aria-label="Buyer response summary"
          />
          <Button
            disabled={isPending || !responseMessage.trim()}
            onClick={() =>
              run(
                () =>
                  logLeadBuyerResponseAction({
                    leadId: lead.id,
                    channel: responseChannel,
                    message: responseMessage,
                  }),
                "Buyer response logged.",
              )
            }
          >
            Log response to buyer
          </Button>
        </Field>
      </FieldGroup>

      <Separator />

      <div className="flex flex-col gap-2">
        {canContact && lead.status !== LeadStatus.CONTACTED ? (
          <Button
            disabled={isPending}
            variant="outline"
            onClick={() => run(() => markLeadContactedAction(lead.id), "Marked as contacted.")}
          >
            Mark contacted (no message)
          </Button>
        ) : null}
        {canQualify ? (
          <Button
            variant="secondary"
            disabled={isPending}
            onClick={() => run(() => qualifyLeadAction(lead.id), "Buyer qualified.")}
          >
            Qualify buyer
          </Button>
        ) : null}
        {canViewing ? (
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() =>
              run(
                () => scheduleLeadViewingAction(lead.id, viewingNote || undefined),
                "Viewing scheduled.",
              )
            }
          >
            Schedule viewing
          </Button>
        ) : null}
        {canOfferMade ? (
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() =>
              run(
                () =>
                  transitionLeadStatusAction({
                    leadId: lead.id,
                    toStatus: LeadStatus.OFFER_MADE,
                    message: "Lead progressed to formal offer.",
                  }),
                "Lead marked as offer made.",
              )
            }
          >
            Mark offer made
          </Button>
        ) : null}
      </div>

      {canViewing ? (
        <Field>
          <FieldLabel htmlFor="viewing-note">Viewing note (optional)</FieldLabel>
          <Textarea
            id="viewing-note"
            rows={2}
            value={viewingNote}
            onChange={(e) => setViewingNote(e.target.value)}
            placeholder="Proposed date, airfield, PIC requirements…"
          />
        </Field>
      ) : null}

      {isDocRequest ? (
        <FieldGroup className="rounded-lg border border-border p-3">
          <Field>
            <FieldLabel>Document access</FieldLabel>
            <FieldDescription>{getLeadTypeMeta(lead.type).description}</FieldDescription>
            <Textarea
              rows={2}
              value={docNote}
              onChange={(e) => setDocNote(e.target.value)}
              placeholder="Internal note for grant/deny decision…"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                disabled={isPending}
                onClick={() =>
                  run(
                    () => grantLeadDocAccessAction(lead.id, docNote || undefined),
                    "Document access granted.",
                  )
                }
              >
                Grant access
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  run(
                    () => denyLeadDocAccessAction(lead.id, docNote || undefined),
                    "Document access denied.",
                  )
                }
              >
                Deny access
              </Button>
            </div>
          </Field>
        </FieldGroup>
      ) : null}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="lead-note">Internal note</FieldLabel>
          <FieldDescription>Seller/admin only — never shown to the buyer.</FieldDescription>
          <Textarea
            id="lead-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ops notes, negotiation context, inspection constraints…"
          />
          <Button
            variant="outline"
            size="sm"
            disabled={isPending || !note.trim()}
            onClick={() => run(() => addLeadNoteAction(lead.id, note), "Internal note added.")}
          >
            Add internal note
          </Button>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel>Next follow-up</FieldLabel>
          <LeadFollowUpPicker
            value={followUpDate}
            onChange={setFollowUpDate}
            disabled={isPending}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isPending || !followUpDate}
              onClick={() =>
                run(
                  () => setLeadFollowUpAction(lead.id, followUpDate!.toISOString()),
                  "Follow-up scheduled.",
                )
              }
            >
              Set follow-up
            </Button>
            {lead.nextFollowUpAt ? (
              <Button
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => {
                  setFollowUpDate(undefined);
                  run(() => setLeadFollowUpAction(lead.id, null), "Follow-up cleared.");
                }}
              >
                Clear
              </Button>
            ) : null}
          </div>
        </Field>
      </FieldGroup>

      {canUnqualify ? (
        <Field>
          <FieldLabel htmlFor="unqualify-reason">Unqualify buyer</FieldLabel>
          <Textarea
            id="unqualify-reason"
            rows={2}
            value={unqualifyReason}
            onChange={(e) => setUnqualifyReason(e.target.value)}
            placeholder="Reason for unqualifying this enquiry…"
          />
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending || !unqualifyReason.trim()}
            onClick={() =>
              run(
                () => unqualifyLeadAction(lead.id, unqualifyReason),
                "Buyer unqualified.",
              )
            }
          >
            Unqualify
          </Button>
        </Field>
      ) : null}

      {canClose ? (
        <FieldGroup className="border-t border-border pt-4">
          <Field>
            <FieldLabel htmlFor="close-reason">Close lead</FieldLabel>
            <Textarea
              id="close-reason"
              rows={2}
              value={closeReason}
              onChange={(e) => setCloseReason(e.target.value)}
              placeholder="Why is this enquiry being closed?"
            />
            <Button
              variant="outline"
              size="sm"
              disabled={isPending || !closeReason.trim()}
              onClick={() => run(() => closeLeadAction(lead.id, closeReason), "Lead closed.")}
            >
              Close lead
            </Button>
          </Field>
        </FieldGroup>
      ) : null}

      <Button variant="link" className="h-auto p-0" render={<Link href={lead.listing.href} />}>
        Open listing workspace
      </Button>
    </div>
  );
};

export default LeadWorkspaceActions;
