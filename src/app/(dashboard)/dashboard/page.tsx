import { Metadata } from "next";
import DashboardHome from "@/components/dashboard/seller/home/seller-dashboard-home";
import { requireAuth } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard | AVIATONLY",
  description: "Your AVIATONLY dashboard for aircraft listings, enquiries, offers, and deals.",
};

const page = async () => {
  await requireAuth();
  return <DashboardHome />;
};

export default page;
