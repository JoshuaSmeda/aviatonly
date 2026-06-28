import React from "react";

import { Metadata } from "next";
import PaginationTable from "@/app/components/react-tables/pagination/page";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";

export const metadata: Metadata = {
  title: "Pagination Table",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Pagination Table",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="Pagination Table " items={BCrumb} />
      <PaginationTable />
    </>
  );
}

export default page;
