import React from "react";
import { Card } from "@/components/ui/card";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";

import InvoiceList from "@/app/components/apps/invoice/invoice-list/index";
import DetailCard from "@/app/components/apps/invoice/invoice-list/detailcard";
import { InvoiceProvider } from "@/app/context/invoice-context/index";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Invoice List App",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Invoice List",
  },
];
function List() {
  return (
    <InvoiceProvider>
      <BreadcrumbComp title="Invoice List" items={BCrumb} />
      <DetailCard />
      <Card className="p-6">
        <InvoiceList />
      </Card>
    </InvoiceProvider>
  );
}
export default List;
