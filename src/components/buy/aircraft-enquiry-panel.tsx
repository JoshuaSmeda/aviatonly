"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Mail, Phone } from "lucide-react";
import { submitListingEnquiryAction } from "@/app/(dashboard)/dashboard/buy/enquiry-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
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
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending: isSessionPending } = useSession();
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [message, setMessage] = useState(
    `Hi, I would like to know more about ${listing.registration} — ${formatAircraftTitle(listing)}.`,
  );

  const signInHref = `/auth/auth1/login?callbackUrl=${encodeURIComponent(pathname)}`;
  const isAuthenticated = Boolean(session?.user);

  function handleSubmit() {
    startSubmitTransition(async () => {
      const result = await submitListingEnquiryAction({
        listingId: listing.id,
        message,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(
        result.reusedExistingLead
          ? "Message added to your existing conversation"
          : "Message sent to the listing contact",
        {
          description: "You can continue the conversation in your AVIATONLY inbox.",
          action: {
            label: "View conversation",
            onClick: () => router.push(`/dashboard/messages/${result.leadId}`),
          },
        },
      );
    });
  }

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
        {isSessionPending ? (
          <p className="text-sm text-muted-foreground">Checking sign-in status…</p>
        ) : isAuthenticated ? (
          <>
            {session?.user.name ? (
              <p className="text-sm text-muted-foreground">
                Sending as <span className="font-medium text-foreground">{session.user.name}</span>
              </p>
            ) : null}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="enquiry-message">Message</FieldLabel>
                <Textarea
                  id="enquiry-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  disabled={isSubmitting}
                />
              </Field>
            </FieldGroup>
            <Button className="w-full" disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
              Send message
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Sign in to message the listing contact through AVIATONLY. Your enquiry is saved to
              your account and linked to this aircraft.
            </p>
            <Button className="w-full" render={<Link href={signInHref} />}>
              Sign in to message
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
