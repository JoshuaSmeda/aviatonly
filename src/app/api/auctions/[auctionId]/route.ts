import { NextResponse } from "next/server";
import {
  getPublicAuctionStateByListingIdRecord,
  getPublicAuctionStateRecord,
} from "@/lib/aviatonly/server/auction/auction-admin";
import { NotFoundError } from "@/lib/aviatonly/server/authorization";

export async function GET(
  request: Request,
  context: { params: Promise<{ auctionId: string }> },
) {
  const { auctionId } = await context.params;
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");

  try {
    const state = listingId
      ? await getPublicAuctionStateByListingIdRecord(listingId)
      : await getPublicAuctionStateRecord(auctionId);

    if (!state) {
      return NextResponse.json({ error: "Auction not found." }, { status: 404 });
    }

    return NextResponse.json(state);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to load auction state." }, { status: 500 });
  }
}
