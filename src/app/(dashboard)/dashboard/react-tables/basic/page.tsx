import React from "react";

import { Metadata } from "next";
import ReactBasicTables from "@/components/dashboard/react-tables/react-basics/basic-tables";
import StripedTable from "@/components/dashboard/react-tables/react-basics/striped-table";
import FooterTable from "@/components/dashboard/react-tables/react-basics/footer-table";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";

export const metadata: Metadata = {
  title: "Basic Tables List",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Tables List",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="Basic Tables List" items={BCrumb} />
      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-12">
          <ReactBasicTables />
        </div>
        <div className="col-span-12">
          <StripedTable />
        </div>
        <div className="col-span-12">
          <FooterTable />
        </div>
      </div>
    </>
  );
}

export default page;
