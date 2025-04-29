"use client";
import React from "react";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import Loader from "@/app/shared/components/Loader";
import { ImgComp } from "@/app/shared/ImgComp";
import { UPDATE_CART_ITEM, REMOVE_FROM_CART } from "@/app/shared/utils/queries";
import { CartItem } from "@/app/(landingPage)/shared/type";
import { X } from "lucide-react";

interface CartContentProps {
  cartItems: CartItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: (variables?: any) => void;
  loading: boolean;
}

const CartContent: React.FC<CartContentProps> = ({
  cartItems,
  loading,
  refetch,
}) => {
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);

  const handleIncrement = async (itemId: string, currentQuantity: number) => {
    try {
      await updateCartItem({
        variables: { itemId, quantity: currentQuantity + 1 },
      });
      refetch();
    } catch (err) {
      console.error("Failed to increment quantity:", err);
    }
  };

  const handleDecrement = async (itemId: string, currentQuantity: number) => {
    if (currentQuantity <= 1) return;
    try {
      await updateCartItem({
        variables: { itemId, quantity: currentQuantity - 1 },
      });
      refetch();
    } catch (err) {
      console.error("Failed to decrement quantity:", err);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeFromCart({ variables: { itemId } });
      refetch();
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  };

  if (loading) return <Loader />;

  // Calculate total price by summing each cart item's (price * quantity)
  const totalPrice = cartItems.reduce(
    (sum: number, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">
          Your cart is empty. Start shopping now!
        </p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center">
                <ImgComp
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium">{item.product.title}</h3>
                  <p className="text-gray-600">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  onClick={() => handleDecrement(item.id, item.quantity)}
                >
                  -
                </button>
                <span className="font-bold">{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  onClick={() => handleIncrement(item.id, item.quantity)}
                >
                  +
                </button>
                <button
                  className="px-2 py-1 bg-red-500 rounded hover:bg-red-600 transition text-white ml-2"
                  onClick={() => handleRemove(item.id)}
                >
                  <X />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <span className="text-xl font-bold">
              Total: ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      )}
      <div className="mt-6 text-center">
        <Link href="/cart">
          <span className="inline-block bg-primaryx hover:bg-primaryx-hover text-white py-2 px-6 rounded-full transition duration-200">
            View All Cart
          </span>
        </Link>
      </div>
    </div>
  );
};

export default CartContent;
