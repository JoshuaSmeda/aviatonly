import React from "react";

import { Button } from "@/components/ui/button";

import { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard)/dashboard/layout/shared/breadcrumb/breadcrumb-comp";
import GeneralDetail from "@/components/dashboard/apps/ecommerce/addproduct/general-detail";
import Media from "@/components/dashboard/apps/ecommerce/addproduct/medias";
import Variation from "@/components/dashboard/apps/ecommerce/addproduct/product-variation";
import Pricing from "@/components/dashboard/apps/ecommerce/addproduct/pricings";
import Thumbnail from "@/components/dashboard/apps/ecommerce/addproduct/thumbnails";
import Status from "@/components/dashboard/apps/ecommerce/addproduct/status-products";
import ProductData from "@/components/dashboard/apps/ecommerce/addproduct/product-data";
import Producttemplate from "@/components/dashboard/apps/ecommerce/addproduct/product-template";
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Add Product",
  },
];
export const metadata: Metadata = {
  title: "Add Product",
};
const AddProduct = () => {
  return (
    <>
      <BreadcrumbComp title="Add Product" items={BCrumb} />
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-8 col-span-12">
          <div className="flex flex-col gap-6">
            {/* General */}
            <GeneralDetail />
            {/* Media  */}
            <Media />
            {/* Variation  */}
            <Variation />
            {/* Pricing  */}
            <Pricing />
          </div>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <div className="flex flex-col gap-6">
            {/* Thumbnail */}
            <Thumbnail />
            {/* Status */}
            <Status />
            {/* ProductData */}
            <ProductData />
            {/* Producttemplate */}
            <Producttemplate />
          </div>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <div className="sm:flex gap-3">
            <Button className="sm:mb-0 mb-3 w-fit ">
              Save changes
            </Button>
            <Button variant={"destructive"} className="w-fit">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
