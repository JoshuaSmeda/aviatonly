import React from "react";

import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import { ProductProvider } from "@/app/context/ecommerce-context";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import ProductCarousel from "@/app/components/apps/ecommerce/productdetail/product-carousel";
import ProductDetail from "@/app/components/apps/ecommerce/productdetail";
import ProductDesc from "@/app/components/apps/ecommerce/productdetail/product-desc";
import ProductRelated from "@/app/components/apps/ecommerce/productdetail/product-related";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Shop Detail",
  },
];
export const metadata: Metadata = {
  title: "Shop Detail",
};

const EcommerceDetail = () => {
  return (
    <>
      <ProductProvider>
        <BreadcrumbComp title="Shop Detail" items={BCrumb} />
        {/* Slider and Details of Products */}
        <Card>
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-6 col-span-12">
              <ProductCarousel />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <ProductDetail />
            </div>
          </div>
        </Card>
        {/* Description Tabs Products */}
        <Card className="mt-[30px] pt-2">
          <ProductDesc />
        </Card>
        {/* Related Products */}
        <ProductRelated />
      </ProductProvider>
    </>
  );
};

export default EcommerceDetail;
