import { auth } from "@/lib/auth";
import { hasAnyRole, parseRoles, SELLER_ROLES } from "@/lib/auth/roles";
import { persistAircraftDocumentUpload } from "@/lib/upload/persist-aircraft-document";
import { persistAircraftPhotoUpload } from "@/lib/upload/persist-aircraft-photo";
import { isGuidedDocumentSlotKey } from "@/lib/upload/document-slot-keys";
import { isGuidedPhotoSlotKey } from "@/lib/upload/photo-slot-keys";
import { getUploadKit, setR2ObjectMetadata } from "@/lib/upload/r2-storage";
import { isR2UploadConfigured } from "@/lib/upload/r2-env";

function randomSuffix() {
  return Math.random().toString(36).slice(2, 10);
}

function sanitizeExtension(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "jpg";
  return ext || "jpg";
}

function sanitizeDocumentExtension(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "pdf";
  return ext || "pdf";
}

function buildUploadRouter() {
  const kit = getUploadKit();
  if (!kit) {
    throw new Error("R2 upload is not configured.");
  }

  const { s3 } = kit;

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

        await setR2ObjectMetadata(key, {
          uploadedById: metadata.userId,
          listingId: metadata.listingId,
          slotKey: metadata.slotKey,
          fileName: file.name,
        });

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
    guidedDocument: s3
      .file()
      .maxFileSize("25MB")
      .accept([
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
      ])
      .middleware(async ({ req, metadata }) => {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session?.user?.id) {
          throw new Error("You must be signed in to upload documents.");
        }

        const roles = parseRoles(session.user.roles);
        if (!hasAnyRole(roles, SELLER_ROLES)) {
          throw new Error("Only sellers can upload aircraft documents.");
        }

        const listingId = String(metadata?.listingId ?? "");
        const documentType = String(metadata?.documentType ?? "");

        if (!listingId || !documentType) {
          throw new Error("listingId and documentType are required for guided document uploads.");
        }

        if (!isGuidedDocumentSlotKey(documentType)) {
          throw new Error("Unknown guided document slot.");
        }

        return {
          listingId,
          documentType,
          userId: session.user.id,
        };
      })
      .paths({
        generateKey: ({ file, metadata }) => {
          const ext = sanitizeDocumentExtension(file.name);
          return `listings/${metadata.listingId}/documents/${metadata.documentType}/${Date.now()}-${randomSuffix()}.${ext}`;
        },
      })
      .onUploadComplete(async ({ file, key, metadata }) => {
        if (!key) return;

        await setR2ObjectMetadata(key, {
          uploadedById: metadata.userId,
          listingId: metadata.listingId,
          documentType: metadata.documentType,
          fileName: file.name,
          visibility: "PRIVATE_INTERNAL",
        });

        await persistAircraftDocumentUpload({
          listingId: metadata.listingId,
          documentType: metadata.documentType,
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
