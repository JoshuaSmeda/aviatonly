import { NextResponse } from "next/server";
import { getPublicAuctionBidHistoryRecord } from "@/lib/aviatonly/server/auction/public-bid-history";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";
import { getSession } from "@/lib/auth/session";

export async function GET(
  _request: Request,
  context: { params: Promise<{ auctionId: string }> },
) {
  const { auctionId } = await context.params;

  try {
    const session = await getSession();
    const bids = await getPublicAuctionBidHistoryRecord(
      auctionId,
      session?.user.id ?? null,
    );
    return NextResponse.json({ bids });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to load bid history." }, { status: 500 });
  }
}
