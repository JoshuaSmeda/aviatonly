import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AircraftVerificationSummary } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";

interface AircraftVerificationSummaryProps {
  verification: AircraftVerificationSummary;
}

export function AircraftVerificationSummaryCard({ verification }: AircraftVerificationSummaryProps) {
  const items = [
    verification.documentsReviewed ? "Documents reviewed" : null,
    verification.photosVerified ? "Photos verified" : null,
    verification.inspectionCompleted ? "Independent inspection completed" : null,
    verification.inspectionAvailable ? "Inspection available on request" : null,
  ].filter(Boolean) as string[];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck />
          AVIATONLY review status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="text-primary" />
              {item}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Seller-provided documents are under review. AVIATONLY will update this section once review is complete.
          </p>
        )}
        {verification.notes ? (
          <p className="text-sm text-muted-foreground">{verification.notes}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
