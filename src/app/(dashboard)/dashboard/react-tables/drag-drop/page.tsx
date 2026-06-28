import React from "react";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import { Metadata } from "next";

import Columndragdrop from "@/components/dashboard/react-tables/drag-drop/column-dragdrop";
import Rowdragdrop from "@/components/dashboard/react-tables/drag-drop/row-dragdrop";
export const metadata: Metadata = {
  title: "DragDrop Table ",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Drag & Drop Table ",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="Drag & Drop Table " items={BCrumb} />
      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-12">
          <Rowdragdrop />
        </div>
        <div className="col-span-12">
          <Columndragdrop />
        </div>
      </div>
    </>
  );
}

export default page;
