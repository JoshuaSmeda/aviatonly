import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import AircraftIntakeWizard from "@/components/dashboard/seller/intake/aircraft-intake-wizard";

export const metadata: Metadata = {
  title: "Sell Your Aircraft | AVIATONLY",
};

const SellAircraftPage = () => {
  return (
    <>
      <BreadcrumbComp title="Sell Your Aircraft" />
      <TitleCard title="Aircraft intake — submit for AVIATONLY review">
        <AircraftIntakeWizard />
      </TitleCard>
    </>
  );
};

export default SellAircraftPage;
