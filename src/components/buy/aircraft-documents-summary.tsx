"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { AircraftDocumentSummary } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import { toast } from "sonner";

interface AircraftDocumentsSummaryProps {
  documents: AircraftDocumentSummary[];
}

export function AircraftDocumentsSummary({ documents }: AircraftDocumentsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText />
          Documents available
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {documents.map((document) => (
          <div key={document.label} className="flex flex-col gap-1 border-b pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium">{document.label}</span>
            <span className="text-sm text-muted-foreground">{document.status}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => toast.message("Document access request recorded for AVIATONLY review")}
        >
          Request document access
        </Button>
      </CardFooter>
    </Card>
  );
}
