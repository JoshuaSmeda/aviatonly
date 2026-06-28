import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";

import { Metadata } from "next";
import Editable from "@/components/dashboard/react-tables/editable/page";

export const metadata: Metadata = {
  title: "Editable Table",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Editable Table",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="Editable Table " items={BCrumb} />
      <Editable />
    </>
  );
}

export default page;
