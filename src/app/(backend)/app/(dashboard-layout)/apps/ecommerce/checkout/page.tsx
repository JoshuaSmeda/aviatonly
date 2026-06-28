import { Card } from "@/components/ui/card";
import React from "react";

import { Metadata } from "next";
import { ProductProvider } from "@/app/context/ecommerce-context";
import ProductCheckout from "@/app/components/apps/ecommerce/checkout/product-checkout";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Checkout",
  },
];
export const metadata: Metadata = {
  title: "Checkout App",
};

const Checkout = () => {
  return (
    <>
      <ProductProvider>
        <BreadcrumbComp title="Checkout" items={BCrumb} />
        <Card>
          <ProductCheckout />
        </Card>
      </ProductProvider>
    </>
  );
};

export default Checkout;
