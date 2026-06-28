"use client";

import ProductFilter from "@/components/dashboard/apps/ecommerce/product-grid/product-filter";
import ProductList from "@/components/dashboard/apps/ecommerce/product-grid/product-list";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // <- ShadCN Sheet
import { useContext, useState } from "react";
import CardBox from "@/components/dashboard/shared/CardBox";
import { ProductProvider } from "@/app/context/ecommerce-context";
import { CustomizerContext } from "@/app/context/customizer-context";

const EcommerceShop = () => {
  const [isOpenShop, setIsOpenShop] = useState(false);
  const { activeDir } = useContext(CustomizerContext);

  return (
    <ProductProvider>
      <CardBox className="p-0">
        <div className="flex">
          {/* ------------------------------------------- */}
          {/* Left Filter Sidebar for mobile using Sheet */}
          {/* ------------------------------------------- */}
          <div className="lg:relative lg:block hidden max-w-[250px] w-full">
            <ProductFilter />
          </div>

          {/* Mobile Filter using Sheet/Drawer */}
          <Sheet open={isOpenShop} onOpenChange={setIsOpenShop}>
            <SheetContent
              side={activeDir === "rtl" ? "right" : "left"}
              className="w-[250px] p-0 lg:hidden"
            >
              <ProductFilter />
            </SheetContent>
          </Sheet>

          {/* ------------------------------------------- */}
          {/* Product List */}
          {/* ------------------------------------------- */}
          <div className="p-6 w-full">
            <ProductList openShopFilter={setIsOpenShop} />
          </div>
        </div>
      </CardBox>
    </ProductProvider>
  );
};

export default EcommerceShop;
