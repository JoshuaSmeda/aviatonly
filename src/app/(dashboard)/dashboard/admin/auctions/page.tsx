import { redirect } from "next/navigation";

export default function AdminAuctionsRedirectPage() {
  redirect("/dashboard/auctions");
}
