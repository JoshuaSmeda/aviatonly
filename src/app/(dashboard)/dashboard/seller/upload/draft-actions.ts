"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface SaveDraftInput {
  draftId: string | null;
  data: Record<string, unknown>;
  step: number;
}

export interface DraftPayload {
  data: Record<string, unknown>;
  step: number;
}

/** JSON-safe clone so values like Date are stored as ISO strings in the Json column. */
function toJson(data: Record<string, unknown>): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
}

export async function saveDraft({ draftId, data, step }: SaveDraftInput): Promise<{ id: string }> {
  const json = toJson(data);

  if (draftId) {
    try {
      const updated = await prisma.listingDraft.update({
        where: { id: draftId },
        data: { data: json, step },
        select: { id: true },
      });
      return { id: updated.id };
    } catch {
      // Draft was removed (e.g. submitted) — fall through and create a fresh one.
    }
  }

  const created = await prisma.listingDraft.create({
    data: { data: json, step },
    select: { id: true },
  });
  return { id: created.id };
}

export async function loadDraft(draftId: string): Promise<DraftPayload | null> {
  const draft = await prisma.listingDraft.findUnique({
    where: { id: draftId },
    select: { data: true, step: true },
  });
  if (!draft) return null;
  return {
    data: (draft.data as Record<string, unknown>) ?? {},
    step: draft.step,
  };
}

export async function deleteDraft(draftId: string): Promise<void> {
  try {
    await prisma.listingDraft.delete({ where: { id: draftId } });
  } catch {
    // Already deleted — nothing to do.
  }
}
