import { createUploadConfig } from "pushduck/server";
import type { UploadInitResult } from "pushduck/server";
import { getR2Config, isR2UploadConfigured } from "@/lib/upload/r2-env";

let cachedKit: UploadInitResult | null = null;

export function getUploadKit(): UploadInitResult | null {
  if (!isR2UploadConfigured()) {
    return null;
  }

  if (!cachedKit) {
    const r2 = getR2Config();
    cachedKit = createUploadConfig()
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
  }

  return cachedKit;
}

export function isRemoteStorageKey(storageKey: string | null | undefined): storageKey is string {
  return Boolean(storageKey && !storageKey.startsWith("local/"));
}

export async function getR2PresignedDownloadUrl(storageKey: string, expiresIn = 3600) {
  const kit = getUploadKit();
  if (!kit) {
    throw new Error("R2 storage is not configured.");
  }

  return kit.storage.download.presignedUrl(storageKey, expiresIn);
}

export async function deleteR2Object(storageKey: string) {
  const kit = getUploadKit();
  if (!kit) {
    throw new Error("R2 storage is not configured.");
  }

  await kit.storage.delete.file(storageKey);
}

export async function setR2ObjectMetadata(
  storageKey: string,
  metadata: Record<string, string>,
) {
  const kit = getUploadKit();
  if (!kit) {
    return;
  }

  try {
    await kit.storage.metadata.setCustom(storageKey, metadata);
  } catch (error) {
    console.warn("setR2ObjectMetadata failed", storageKey, error);
  }
}
