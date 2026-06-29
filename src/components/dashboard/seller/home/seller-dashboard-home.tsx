import { SELLER_ROLES } from "@/lib/auth/roles";
import { requireAnyRole } from "@/lib/auth/session";
import { getSellerDashboardData } from "@/lib/aviatonly/server/seller-dashboard";
import SummaryStats from "./summary-stats";
import ActionRequired from "./action-required";
import MyAircraft from "./my-aircraft";
import BuyerActivity from "./buyer-activity";
import DealProgress from "./deal-progress";
import RecentActivity from "./recent-activity";

const SellerDashboardHome = async () => {
  const session = await requireAnyRole(SELLER_ROLES);
  const data = await getSellerDashboardData(session.user.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h4 className="text-2xl font-semibold">Welcome back</h4>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your aircraft and what AVIATONLY needs from you.
        </p>
      </div>

      <SummaryStats aircraft={data.aircraft} actionItems={data.actionItems} />
      <ActionRequired items={data.actionItems} />
      <MyAircraft aircraft={data.aircraft} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <BuyerActivity activity={data.buyerActivity} />
        <DealProgress deals={data.dealProgress} />
        <RecentActivity activity={data.recentActivity} />
      </div>
    </div>
  );
};

export default SellerDashboardHome;
