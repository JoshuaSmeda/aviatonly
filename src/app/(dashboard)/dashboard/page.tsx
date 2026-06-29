import { Metadata } from "next";
import SellerDashboardHome from "@/components/dashboard/seller/home/seller-dashboard-home";

export const metadata: Metadata = {
  title: "Seller Dashboard | AVIATONLY",
  description: "Action-led seller dashboard for managing aircraft listings, leads, and deals.",
};

const page = () => {
  return <SellerDashboardHome />;
};

export default page;
