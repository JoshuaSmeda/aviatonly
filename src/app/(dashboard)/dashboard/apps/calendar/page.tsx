import CalendarApp from "@/components/dashboard/apps/calendar";

import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
export const metadata: Metadata = {
  title: "Calendar App",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Calendar",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Calendar" items={BCrumb} />
      <CalendarApp />
    </>
  );
};

export default page;
