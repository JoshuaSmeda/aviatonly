"use client";

import { createUploadClient } from "pushduck/client";
import type { AppUploadRouter } from "@/lib/upload/router";

export const aircraftUpload = createUploadClient<AppUploadRouter>({
  endpoint: "/api/upload",
});

export function isClientUploadEnabled() {
  return process.env.NEXT_PUBLIC_R2_UPLOAD_ENABLED === "true";
}
