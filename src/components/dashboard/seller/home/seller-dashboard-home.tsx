import { requireAuth } from "@/lib/auth/session";
import { getSellerDashboardData } from "@/lib/aviatonly/server/seller-dashboard";
import SummaryStats from "./summary-stats";
import ActionRequired from "./action-required";
import MyAircraft from "./my-aircraft";
import BuyerActivity from "./buyer-activity";
import DealProgress from "./deal-progress";
import RecentActivity from "./recent-activity";

const DashboardHome = async () => {
  const session = await requireAuth();
  const data = await getSellerDashboardData(session.user.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h4 className="text-2xl font-semibold">Welcome back</h4>
        <p className="text-sm text-muted-foreground">
          Your aircraft, enquiries, offers, and deals in one place.
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

export default DashboardHome;
