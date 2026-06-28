import React from "react";

import { InvoiceProvider } from "@/app/context/invoice-context/index";
import InvoiceDetail from "@/components/dashboard/apps/invoice/invoice-detail/index";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
export const metadata: Metadata = {
  title: "Invoice Details App ",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Invoice Details",
  },
];

function InvoiceDetailPage() {
  return (
    <InvoiceProvider>
      <BreadcrumbComp title="Invoice Details" items={BCrumb} />
      <Card className="p-6">
        <InvoiceDetail />
      </Card>
    </InvoiceProvider>
  );
}
export default InvoiceDetailPage;
