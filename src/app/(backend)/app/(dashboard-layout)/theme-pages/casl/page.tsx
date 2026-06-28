import RollBaseIndex from "@/app/components/theme-pages/casl";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CASL Page",
  description: "View and manage user roles and permissions.",
};



const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "CASL",
  },
];


const RollBase = () => {

  return (
    <>
      <BreadcrumbComp title="Rollbase Access" items={BCrumb} />
      <RollBaseIndex />
    </>
  );
};

export default RollBase;
