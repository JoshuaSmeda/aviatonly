import { redirect } from "next/navigation";

export default function PublicBuyRedirectPage() {
  redirect("/dashboard/buy");
}
