import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useContext } from "react";
import { Icon } from "@iconify/react";
import { ProductContext } from "@/app/context/ecommerce-context";
import PlaceholdersInput from "@/components/dashboard/animated-components/animatedinput-placeholder";
import { SearchIcon } from "lucide-react";

type Props = {
  onClickFilter: (event: React.MouseEvent<HTMLElement>) => void;
};
const ProductSearch = ({ onClickFilter }: Props) => {
  const { searchProduct, searchProducts } = useContext(ProductContext);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <h5 className=" lg:flex hidden">Products</h5>
          <Button
            className="!h-8 !w-8  p-0 lg:!hidden flex bg-primary/5 text-primary"
            onClick={onClickFilter}
          >
            <Icon icon="tabler:menu-2" height={18} />
          </Button>
        </div>
        <div className="relative">
          <PlaceholdersInput
            value={searchProduct}
            onChange={searchProducts}
            placeholders={[
              "Search Product...",
              "Find What you want...",
              "Look up Products...",
            ]}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2  text-muted-foreground">

            <SearchIcon size={16} />

          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSearch;
