"use client";
import { toast } from "sonner";
import { useAddToCart } from "./useAddToCart";
import { useGetCurrentUser } from "./useGetCurrentUser";
import client from "@/app/lib/apollo-client";

export function useAddProductToCart() {
  const { addToCart, loading } = useAddToCart();
  const { currentUser } = useGetCurrentUser();

  const addProductToCart = async (
    productId: string,
    quantity: number,
    openLoginModal?: () => void
  ) => {
    if (!currentUser) {
      toast.error("Please login to add product to cart!");
      if (openLoginModal) openLoginModal();
      return;
    }
    try {
      await addToCart({
        variables: { productId, quantity },
      });
      await client.resetStore();
      toast.success("Product added to cart!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
      console.error(error);
      toast.error("Failed to add product to cart");
    }
  };

  return { addProductToCart, loading };
}
