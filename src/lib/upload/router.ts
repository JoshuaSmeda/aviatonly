import { createUploadConfig } from "pushduck/server";
import { auth } from "@/lib/auth";
import { hasAnyRole, parseRoles, SELLER_ROLES } from "@/lib/auth/roles";
import { persistAircraftPhotoUpload } from "@/lib/upload/persist-aircraft-photo";
import { isGuidedPhotoSlotKey } from "@/lib/upload/photo-slot-keys";
import { getR2Config, isR2UploadConfigured } from "@/lib/upload/r2-env";

function randomSuffix() {
  return Math.random().toString(36).slice(2, 10);
}

function sanitizeExtension(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "jpg";
  return ext || "jpg";
}

function buildUploadRouter() {
  const r2 = getR2Config();

  const { s3 } = createUploadConfig()
    .provider("cloudflareR2", {
      accountId: r2.accountId,
      accessKeyId: r2.accessKeyId,
      secretAccessKey: r2.secretAccessKey,
      bucket: r2.bucket,
      region: "auto" as const,
    })
    .defaults({
      maxFileSize: "12MB",
    })
    .paths({
      prefix: "aviatonly",
    })
    .build();

  const router = s3.createRouter({
    guidedPhoto: s3
      .image()
      .maxFileSize("12MB")
      .accept(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"])
      .middleware(async ({ req, metadata }) => {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session?.user?.id) {
          throw new Error("You must be signed in to upload photos.");
        }

        const roles = parseRoles(session.user.roles);
        if (!hasAnyRole(roles, SELLER_ROLES)) {
          throw new Error("Only sellers can upload aircraft photos.");
        }

        const listingId = String(metadata?.listingId ?? "");
        const slotKey = String(metadata?.slotKey ?? "");

        if (!listingId || !slotKey) {
          throw new Error("listingId and slotKey are required for guided photo uploads.");
        }

        if (!isGuidedPhotoSlotKey(slotKey)) {
          throw new Error("Unknown guided photo slot.");
        }

        return {
          listingId,
          slotKey,
          userId: session.user.id,
        };
      })
      .paths({
        generateKey: ({ file, metadata }) => {
          const ext = sanitizeExtension(file.name);
          return `listings/${metadata.listingId}/photos/${metadata.slotKey}/${Date.now()}-${randomSuffix()}.${ext}`;
        },
      })
      .onUploadComplete(async ({ file, key, metadata }) => {
        if (!key) return;

        await persistAircraftPhotoUpload({
          listingId: metadata.listingId,
          slotKey: metadata.slotKey,
          uploadedById: metadata.userId,
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          storageKey: key,
        });
      }),
  });

  return router;
}

export type AppUploadRouter = ReturnType<typeof buildUploadRouter>;

let cachedRouter: AppUploadRouter | null = null;

export function getUploadRouter() {
  if (!isR2UploadConfigured()) {
    return null;
  }

  if (!cachedRouter) {
    cachedRouter = buildUploadRouter();
  }

  return cachedRouter;
}
