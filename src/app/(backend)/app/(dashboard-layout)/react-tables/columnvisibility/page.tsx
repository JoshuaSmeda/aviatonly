import React from "react";

import { Metadata } from "next";
import ReactColumnVisibilityTable from "@/app/components/react-tables/column-visiblity/page";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";

export const metadata: Metadata = {
  title: "column visibility Table ",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "column visibility Table ",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="column visibility Table " items={BCrumb} />
      <ReactColumnVisibilityTable />
    </>
  );
}

export default page;
