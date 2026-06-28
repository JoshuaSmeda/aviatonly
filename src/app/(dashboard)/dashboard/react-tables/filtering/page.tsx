import { Metadata } from "next";
import FilteringTable from "@/components/dashboard/react-tables/filtering/page";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";

export const metadata: Metadata = {
  title: "Filter Table",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Filter Table",
  },
];
function page() {
  return (
    <>
      <BreadcrumbComp title="Filter Table " items={BCrumb} />

      <FilteringTable />
    </>
  );
}

export default page;
