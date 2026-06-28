"use client";
import { useContext, useState } from "react";
import { Icon } from "@iconify/react";
import { CustomizerContext } from "@/app/context/customizer-context";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CartItems from "./cart-items";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CartItem {
  key: string;
  img: string;
  title: string;
  desc: string;
  price: string;
  quantity: number;
  productType: string;
}

export const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeDir } = useContext(CustomizerContext);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      key: "prod1",
      img: "/images/products/product-1.jpg",
      title: "Supreme toys cooker",
      desc: "Kitchenware Item",
      price: "$250",
      quantity: 5,
      productType: "product1",
    },
    {
      key: "prod2",
      img: "/images/products/product-2.jpg",
      title: "Supreme toys cooker",
      desc: "Kitchenware Item",
      price: "$250",
      quantity: 2,
      productType: "product2",
    },
    {
      key: "prod3",
      img: "/images/products/product-3.jpg",
      title: "Supreme toys cooker",
      desc: "Kitchenware Item",
      price: "$250",
      quantity: 4,
      productType: "product3",
    },
  ]);

  // Update quantity function
  const updateQuantity = (productType: string, actionType: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productType === productType) {
          return {
            ...item,
            quantity:
              actionType === "inc"
                ? item.quantity + 1
                : Math.max(0, item.quantity - 1),
          };
        }
        return item;
      })
    );
  };

  // Calculate total items
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calculate subtotal
  const subTotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace("$", ""));
    return total + price * item.quantity;
  }, 0);

  // Calculate total (subtotal + shipping)
  const total = subTotal + (cartItems.length > 0 ? 100 : 0);

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="relative">
          <span className="h-4 w-4 bg-primary text-white dark:text-black text-w rounded-full absolute top-0 end-0 text-xs text-center ">
            {totalItems}

          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="h-10 w-10 hover:bg-primary/5 rounded-full cursor-pointer"
          >
            <ShoppingCart className="size-5" />
          </Button>
        </div>
      </div>
      {/* ✅ Sheet from ShadCN */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          showCloseButton={false}
          side={activeDir === "rtl" ? "left" : "right"}
          className="max-w-80! w-full p-0"
        >
          <SheetClose className="absolute top-3.5 end-3.5 p-2 hover:bg-primary/15 hover:text-primary rounded-full">
            <Icon icon="tabler:x" width={20} height={20} />
          </SheetClose>
          <SheetHeader className="border-border border-b">
            <SheetTitle className="text-lg font-semibold">
              Shopping Cart
            </SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>
          <CartItems
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            subTotal={subTotal}
            total={total}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
