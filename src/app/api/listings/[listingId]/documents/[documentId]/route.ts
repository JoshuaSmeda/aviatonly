import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ADMIN_ROLES, hasAnyRole, parseRoles, SELLER_ROLES } from "@/lib/auth/roles";
import {
  assertCanAccessGuidedDocument,
  getSignedDownloadForDocument,
} from "@/lib/upload/guided-document-access";
import { isRemoteStorageKey } from "@/lib/upload/r2-storage";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

interface RouteProps {
  params: Promise<{ listingId: string; documentId: string }>;
}

/** Private document download — seller or admin only (buyer access added in deal room later). */
export async function GET(request: Request, { params }: RouteProps) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const roles = parseRoles(session.user.roles);
  if (!hasAnyRole(roles, [...SELLER_ROLES, ...ADMIN_ROLES])) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { listingId, documentId } = await params;

  const document = await prisma.aircraftDocument.findFirst({
    where: { id: documentId, listingId },
    select: {
      id: true,
      storageKey: true,
      fileName: true,
      mimeType: true,
      uploadedById: true,
      visibility: true,
      listing: { select: { sellerId: true, status: true } },
    },
  });

  if (!document || !isRemoteStorageKey(document.storageKey)) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  try {
    await assertCanAccessGuidedDocument(document, session.user.id, roles);
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const signedUrl = await getSignedDownloadForDocument(document);

  if (!signedUrl) {
    return NextResponse.json({ error: "Document file unavailable." }, { status: 404 });
  }

  return NextResponse.redirect(signedUrl, {
    status: 302,
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
