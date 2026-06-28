import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import TitleCard from "@/components/dashboard/shared/titleborder-card";
import AircraftUploadWizard from "@/components/dashboard/seller/upload/aircraft-upload-wizard";

export const metadata: Metadata = {
  title: "Sell Your Aircraft",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Sell Aircraft",
  },
];

const SellAircraftPage = () => {
  return (
    <>
      <BreadcrumbComp title="Sell Your Aircraft" items={BCrumb} />
      <TitleCard title="List your aircraft for sale">
        <AircraftUploadWizard />
      </TitleCard>
    </>
  );
};

export default SellAircraftPage;
