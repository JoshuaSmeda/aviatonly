"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ShieldCheck } from "lucide-react";
import { submitListingEnquiryAction } from "@/app/(dashboard)/dashboard/buy/enquiry-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
          : "Message sent to AVIATONLY",
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
      <div className="flex flex-col gap-4 border-b border-border p-5 lg:p-6">
        <p className="text-lg font-bold text-foreground">Enquire about this aircraft</p>
        <Alert>
          <AlertDescription>
            This aircraft is sold through AVIATONLY&apos;s verified process. We coordinate document
            review, inspection milestones, offers and deposits, SACAA transfer paperwork, and deal
            progress — you work with AVIATONLY throughout, not directly with the seller.
          </AlertDescription>
        </Alert>
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
              Sign in to message AVIATONLY about this aircraft. Your enquiry is saved to your
              account and linked to this listing.
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
