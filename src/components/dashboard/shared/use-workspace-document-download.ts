"use client";

import { useTransition } from "react";
import { getWorkspaceDocumentDownloadPath } from "@/app/(dashboard)/dashboard/seller/upload/document-actions";
import { toast } from "sonner";

export function useWorkspaceDocumentDownload(listingId: string | null) {
  const [isPending, startTransition] = useTransition();

  const openDocument = (documentId: string) => {
    if (!listingId) {
      toast.error("Save this listing draft before opening documents.");
      return;
    }

    startTransition(async () => {
      const result = await getWorkspaceDocumentDownloadPath(listingId, documentId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      window.open(result.path, "_blank", "noopener,noreferrer");
    });
  };

  return { openDocument, isPending };
}
