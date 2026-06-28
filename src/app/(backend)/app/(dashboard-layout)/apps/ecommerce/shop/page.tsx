import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import EcommerceShop from "@/app/components/apps/ecommerce/product-grid";
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
