import React from "react";
import type { Metadata } from "next";
import CreateInvoiceApp from "@/components/dashboard/apps/invoice/add-invoice";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
export const metadata: Metadata = {
  title: "Invoice Create App",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Invoice Create",
  },
];
function CreateList() {
  return (
    <>
      <BreadcrumbComp title=" Create A New Invoice " items={BCrumb} />
      <CreateInvoiceApp />
    </>
  );
}
export default CreateList;
