"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateAuctionSettingsAction } from "@/app/(dashboard)/dashboard/admin/auctions/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AuctionStatus } from "@/lib/aviatonly/domain/auction-status";
import type { PrivateAdminAuctionState } from "@/lib/aviatonly/domain/auction-types";

interface AuctionSettingsFormProps {
  auctionId: string;
  state: PrivateAdminAuctionState;
}

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocalValue(value: string): string {
  return new Date(value).toISOString();
}

const AuctionSettingsForm = ({ auctionId, state }: AuctionSettingsFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const editable =
    state.status === AuctionStatus.DRAFT || state.status === AuctionStatus.SCHEDULED;

  const [startsAt, setStartsAt] = useState(toDatetimeLocalValue(state.startsAt));
  const [endsAt, setEndsAt] = useState(toDatetimeLocalValue(state.effectiveEndsAt));
  const [startingBid, setStartingBid] = useState(String(state.startingBid));
  const [reservePrice, setReservePrice] = useState(String(state.reservePrice));
  const [bidIncrement, setBidIncrement] = useState(String(state.bidIncrement));
  const [currency, setCurrency] = useState(state.currency);
  const [antiSnipeEnabled, setAntiSnipeEnabled] = useState(state.antiSnipeWindowMinutes > 0);
  const [antiSnipeWindowMinutes, setAntiSnipeWindowMinutes] = useState(
    String(state.antiSnipeWindowMinutes || 5),
  );
  const [antiSnipeExtensionMinutes, setAntiSnipeExtensionMinutes] = useState(
    String(state.antiSnipeExtensionMinutes || 5),
  );
  const [maxExtensions, setMaxExtensions] = useState(String(state.maxExtensions));
  const [showReserveStatus, setShowReserveStatus] = useState(state.showReserveStatus);
  const [showBidHistory, setShowBidHistory] = useState(state.showBidHistory);
  const [noReserveConfirmed, setNoReserveConfirmed] = useState(state.noReserveConfirmed);

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateAuctionSettingsAction({
        auctionId,
        startsAt: fromDatetimeLocalValue(startsAt),
        endsAt: fromDatetimeLocalValue(endsAt),
        startingBid: Number(startingBid),
        reservePrice: Number(reservePrice),
        bidIncrement: Number(bidIncrement),
        currency,
        antiSnipeWindowMinutes: antiSnipeEnabled ? Number(antiSnipeWindowMinutes) : 0,
        antiSnipeExtensionMinutes: antiSnipeEnabled ? Number(antiSnipeExtensionMinutes) : 0,
        maxExtensions: antiSnipeEnabled ? Number(maxExtensions) : 0,
        showReserveStatus,
        showReservePrice: false,
        showBidHistory,
        noReserveConfirmed,
      });

      if (!result.ok) {
        toast.error(result.error ?? "Could not save settings.");
        return;
      }

      toast.success("Auction settings saved.");
      router.refresh();
    });
  };

  if (!editable) {
    return (
      <p className="text-sm text-muted-foreground">
        Settings are locked while the auction is live or closed. Use manual close or cancel from the
        actions panel if needed.
      </p>
    );
  }

  return (
    <FieldGroup className="gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="starts-at">Start time</FieldLabel>
          <Input
            id="starts-at"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="ends-at">End time</FieldLabel>
          <Input
            id="ends-at"
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field>
          <FieldLabel htmlFor="opening-bid">Opening bid</FieldLabel>
          <Input
            id="opening-bid"
            type="number"
            min={1}
            step={1}
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="reserve-price">Reserve price (admin only)</FieldLabel>
          <FieldDescription>Never shown on public pages unless explicitly enabled.</FieldDescription>
          <Input
            id="reserve-price"
            type="number"
            min={1}
            step={1}
            value={reservePrice}
            onChange={(e) => setReservePrice(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="bid-increment">Minimum increment</FieldLabel>
          <Input
            id="bid-increment"
            type="number"
            min={1}
            step={1}
            value={bidIncrement}
            onChange={(e) => setBidIncrement(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="currency">Currency</FieldLabel>
          <Input
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            maxLength={3}
          />
        </Field>
      </div>

      <FieldGroup className="rounded-lg border border-border p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <FieldLabel>Anti-sniping</FieldLabel>
            <FieldDescription>
              Extends the end time when bids arrive in the final window.
            </FieldDescription>
          </div>
          <Switch checked={antiSnipeEnabled} onCheckedChange={setAntiSnipeEnabled} />
        </div>
        {antiSnipeEnabled ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="anti-snipe-window">Extension window (minutes)</FieldLabel>
              <Input
                id="anti-snipe-window"
                type="number"
                min={1}
                value={antiSnipeWindowMinutes}
                onChange={(e) => setAntiSnipeWindowMinutes(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="anti-snipe-duration">Extension duration (minutes)</FieldLabel>
              <Input
                id="anti-snipe-duration"
                type="number"
                min={1}
                value={antiSnipeExtensionMinutes}
                onChange={(e) => setAntiSnipeExtensionMinutes(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="max-extensions">Max extensions</FieldLabel>
              <Input
                id="max-extensions"
                type="number"
                min={1}
                value={maxExtensions}
                onChange={(e) => setMaxExtensions(e.target.value)}
              />
            </Field>
          </div>
        ) : null}
      </FieldGroup>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="show-reserve-status"
            checked={showReserveStatus}
            onCheckedChange={(v) => setShowReserveStatus(v === true)}
          />
          <Label htmlFor="show-reserve-status" className="text-sm font-normal">
            Show reserve met / not met on public page (amount stays hidden)
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="show-bid-history"
            checked={showBidHistory}
            onCheckedChange={(v) => setShowBidHistory(v === true)}
          />
          <Label htmlFor="show-bid-history" className="text-sm font-normal">
            Show bid history on public page
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="no-reserve"
            checked={noReserveConfirmed}
            onCheckedChange={(v) => setNoReserveConfirmed(v === true)}
          />
          <Label htmlFor="no-reserve" className="text-sm font-normal">
            Confirm no-reserve sale (ops override — use only when reserve is waived)
          </Label>
        </div>
      </div>

      <Button disabled={isPending} onClick={handleSave}>
        Save auction settings
      </Button>
    </FieldGroup>
  );
};

export default AuctionSettingsForm;
