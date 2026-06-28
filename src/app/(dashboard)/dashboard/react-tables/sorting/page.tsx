import React from "react";

import { Metadata } from "next";
import SortingTable from "@/components/dashboard/react-tables/sorting/page";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";


export const metadata: Metadata = {
  title: "Sorting Table",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Sorting Table",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="Sorting Table" items={BCrumb} />
      <SortingTable />
    </>
  );
}

export default page;
