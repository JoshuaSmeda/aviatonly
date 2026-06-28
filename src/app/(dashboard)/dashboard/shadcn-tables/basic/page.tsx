import { Metadata } from "next";

import TitleCard from "@/components/dashboard/shared/titleborder-card";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import BasicTable from "@/components/dashboard/shadcn-table/basic/basic-table";

export const metadata: Metadata = {
  title: "Basic Table",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Table",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="Shadcn Basic Table" items={BCrumb} />
      <TitleCard title="Basic Table">
        <div className="grid grid-cols-12 gap-7">
          <div className="col-span-12">
            <BasicTable />
          </div>
        </div>
      </TitleCard>
    </>
  );
}

export default page;
