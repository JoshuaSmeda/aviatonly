import { Metadata } from "next";
import { redirect } from "next/navigation";
import SellerDashboardHome from "@/components/dashboard/seller/home/seller-dashboard-home";
import { ADMIN_ROLES, SELLER_ROLES, hasAnyRole } from "@/lib/auth/roles";
import { requireAuth } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Seller Dashboard | AVIATONLY",
  description: "Action-led seller dashboard for managing aircraft listings, leads, and deals.",
};

const page = async () => {
  const session = await requireAuth();
  if (!hasAnyRole(session.user.roles, [...SELLER_ROLES, ...ADMIN_ROLES])) {
    redirect("/dashboard/buy");
  }
  return <SellerDashboardHome />;
};

export default page;
