import { NextResponse } from "next/server";
import { getUploadRouter } from "@/lib/upload/router";
import { isR2UploadConfigured } from "@/lib/upload/r2-env";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isR2UploadConfigured()) {
    return NextResponse.json(
      { error: "R2 upload is not configured on this environment." },
      { status: 503 },
    );
  }

  const router = getUploadRouter();
  if (!router) {
    return NextResponse.json({ error: "Upload router unavailable." }, { status: 503 });
  }

  return router.handlers.GET(request);
}

export async function POST(request: Request) {
  if (!isR2UploadConfigured()) {
    return NextResponse.json(
      { error: "R2 upload is not configured on this environment." },
      { status: 503 },
    );
  }

  const router = getUploadRouter();
  if (!router) {
    return NextResponse.json({ error: "Upload router unavailable." }, { status: 503 });
  }

  return router.handlers.POST(request);
}

export type { AppUploadRouter as AppRouter } from "@/lib/upload/router";
