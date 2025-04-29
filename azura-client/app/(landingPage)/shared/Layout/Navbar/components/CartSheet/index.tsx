"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { GET_CART } from "@/app/shared/utils/queries";
import CartContent from "./CartContent";
import { CartItem } from "@/app/(landingPage)/shared/type";

const CartSheet = () => {
  const { data, loading, refetch } = useQuery(GET_CART);

  const cartItems = data?.cart ?? [];
  const totalItems = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTitle></SheetTitle>
      <SheetTrigger asChild>
        <button className="relative flex items-center cursor-pointer text-white">
          <ShoppingCart size={30} />
          <span className="absolute -top-2 -right-2 bg-primaryx text-black rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs">
            {totalItems}
          </span>
          <span className="font-bold ml-1">Cart</span>
        </button>
      </SheetTrigger>
      <SheetContent className="p-4">
        <CartContent
          loading={loading}
          cartItems={cartItems}
          refetch={refetch}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
