import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import type { AircraftDocumentSummary } from "@/lib/aviatonly/marketplace/aircraft-marketplace-types";
import { countUploadedDocuments } from "@/lib/aviatonly/marketplace/document-checklist";
import { cn } from "@/lib/utils";

interface AircraftDocumentChecklistProps {
  documents: AircraftDocumentSummary[];
  className?: string;
}

const detailCardClass =
  "overflow-hidden rounded-xl border border-border bg-card shadow-none";

export function AircraftDocumentChecklist({
  documents,
  className,
}: AircraftDocumentChecklistProps) {
  const uploadedCount = countUploadedDocuments(documents);

  return (
    <section className={cn(detailCardClass, "p-5 lg:p-6", className)}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-foreground">Documents on file</h2>
          <p className="text-sm text-muted-foreground">
            Seller-uploaded documents held privately by AVIATONLY. Request access to view the
            documents once verified.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit shrink-0">
          {uploadedCount} / {documents.length} uploaded
        </Badge>
      </div>

      <FieldSet>
        <FieldLegend className="sr-only">Uploaded documents checklist</FieldLegend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((document) => (
            <Field
              key={document.slotKey}
              orientation="horizontal"
              className="items-start gap-2.5 rounded-lg border border-border bg-muted/30 px-3 py-2.5"
            >
              <Checkbox
                id={`document-${document.slotKey}`}
                checked={document.uploaded}
                disabled
                className="mt-0.5"
                aria-label={`${document.label} ${document.uploaded ? "uploaded" : "not uploaded"}`}
              />
              <FieldLabel
                htmlFor={`document-${document.slotKey}`}
                className="font-normal leading-snug text-foreground"
              >
                {document.label}
              </FieldLabel>
            </Field>
          ))}
        </div>
      </FieldSet>
    </section>
  );
}
