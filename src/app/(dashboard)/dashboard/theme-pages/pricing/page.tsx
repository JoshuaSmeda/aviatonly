import PricingIndex from "@/components/dashboard/theme-pages/pricing";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pricing Page",
  description: "Explore our subscription and pricing options.",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Pricing",
  },
];

const Pricing = () => {
  return (
    <>
      <BreadcrumbComp title="Pricing" items={BCrumb} />
      <PricingIndex />
    </>
  );
};

export default Pricing;
