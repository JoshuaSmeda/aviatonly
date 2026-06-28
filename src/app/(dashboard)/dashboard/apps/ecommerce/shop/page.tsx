import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import EcommerceShop from "@/components/dashboard/apps/ecommerce/product-grid";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Ecommerce Shop",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Shop",
  },
];

const Ecommerce = () => {
  return (
    <>
      <BreadcrumbComp title="Shop App" items={BCrumb} />
      <EcommerceShop />
    </>
  );
};

export default Ecommerce;
