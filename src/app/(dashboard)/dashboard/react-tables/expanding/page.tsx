import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import { Metadata } from "next";
import ExpandingTable from "@/components/dashboard/react-tables/expanding/page";

export const metadata: Metadata = {
  title: "Expanding Table",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Expanding Table",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="Expanding Table " items={BCrumb} />
      <ExpandingTable />
    </>
  );
}

export default page;
