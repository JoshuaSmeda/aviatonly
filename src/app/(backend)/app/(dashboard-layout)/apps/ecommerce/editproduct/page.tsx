import React from "react";

import { Button } from "@/components/ui/button";

import { Metadata } from "next";
import BreadcrumbComp from "@/app/(dashboard-layout)/layout/shared/breadcrumb/breadcrumb-comp";
import GeneralDetail from "@/app/components/apps/ecommerce/editproduct/general-detail";
import Media from "@/app/components/apps/ecommerce/editproduct/medias";
import Variation from "@/app/components/apps/ecommerce/editproduct/variations";
import Pricing from "@/app/components/apps/ecommerce/editproduct/pricings";
import CustomerReviews from "@/app/components/apps/ecommerce/editproduct/customer-reviews";
import Thumbnail from "@/app/components/apps/ecommerce/editproduct/thumbnails";
import Status from "@/app/components/apps/ecommerce/editproduct/status-product";
import ProductData from "@/app/components/apps/ecommerce/editproduct/product-data";
import ProductrChart from "@/app/components/apps/ecommerce/editproduct/product-chart";
import Producttemplate from "@/app/components/apps/ecommerce/editproduct/product-template";
import { ProductProvider } from "@/app/context/ecommerce-context";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Edit Product",
  },
];

export const metadata: Metadata = {
  title: "Edit Product",
};
const EditProduct = () => {
  return (
    <>
      <ProductProvider>
        <BreadcrumbComp title="Edit Product" items={BCrumb} />
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
              {/* CustomerReviews */}
              <CustomerReviews />
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
              {/* ProductrChart */}
              <ProductrChart />
              {/* Producttemplate */}
              <Producttemplate />
            </div>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <div className="sm:flex gap-3">
              <Button className="sm:mb-0 mb-3 w-fit">
                Save changes
              </Button>
              <Button variant={"destructive"} className="w-fit">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </ProductProvider>
    </>
  );
};

export default EditProduct;
