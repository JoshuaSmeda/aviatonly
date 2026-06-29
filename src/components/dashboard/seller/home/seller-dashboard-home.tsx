import SummaryStats from "./summary-stats";
import ActionRequired from "./action-required";
import MyAircraft from "./my-aircraft";
import BuyerActivity from "./buyer-activity";
import DealProgress from "./deal-progress";
import RecentActivity from "./recent-activity";

const SellerDashboardHome = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h4 className="text-2xl font-semibold">Welcome back</h4>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your aircraft and what AVIATONLY needs from you.
        </p>
      </div>

      <SummaryStats />

      <ActionRequired />

      <MyAircraft />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <BuyerActivity />
        <DealProgress />
        <RecentActivity />
      </div>
    </div>
  );
};

export default SellerDashboardHome;
