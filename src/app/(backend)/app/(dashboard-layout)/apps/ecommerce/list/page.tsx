import React from "react";

import { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import { ProductProvider } from "@/app/context/ecommerce-context";
import ProductTablelist from "@/app/components/apps/ecommerce/product-tablelist/product-tablelist";


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Product list",
  },
];
export const metadata: Metadata = {
  title: "Product List",
};
const EcomProductList = () => {
  return (
    <>
      <ProductProvider>
        <BreadcrumbComp title="Product list" items={BCrumb} />
        <ProductTablelist />
      </ProductProvider>
    </>
  );
};

export default EcomProductList;
