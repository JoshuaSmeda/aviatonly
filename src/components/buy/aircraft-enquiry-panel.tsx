"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AircraftMarketplaceDetail } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import { formatAircraftTitle } from "@/lib/aviatonly/marketplace/aircraft-marketplace-utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AircraftEnquiryPanelProps {
  listing: AircraftMarketplaceDetail;
}

const detailCardClass = "overflow-hidden rounded-xl border border-border bg-card shadow-none";

function contactRoleLabel(listing: AircraftMarketplaceDetail) {
  switch (listing.contact.sellerType) {
    case "AVIATONLY":
    case "BROKER":
      return "Listing agent";
    default:
      return "Listing contact";
  }
}

export function AircraftEnquiryPanel({ listing }: AircraftEnquiryPanelProps) {
  const [message, setMessage] = useState(
    `Hi, I would like to know more about ${listing.registration} — ${formatAircraftTitle(listing)}.`,
  );

  return (
    <div className={cn(detailCardClass)}>
      <div className="flex flex-col gap-3 border-b border-border p-5 lg:p-6">
        <p className="text-xs text-muted-foreground">{contactRoleLabel(listing)}</p>
        <p className="text-lg font-bold text-foreground">{listing.contact.contactName}</p>
        <div className="flex flex-col gap-2">
          {listing.contact.phone ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground [&_svg]:size-[1em] [&_svg]:shrink-0">
              <Phone />
              {listing.contact.phone}
            </p>
          ) : null}
          {listing.contact.email ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground [&_svg]:size-[1em] [&_svg]:shrink-0">
              <Mail />
              {listing.contact.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5 lg:p-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="enquiry-name">Name</FieldLabel>
            <Input id="enquiry-name" placeholder="Your name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="enquiry-message">Message</FieldLabel>
            <Textarea
              id="enquiry-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
            />
          </Field>
        </FieldGroup>

        <Button
          className="w-full"
          onClick={() => toast.success("Message sent to the listing contact")}
        >
          Send message
        </Button>
      </div>
    </div>
  );
}
