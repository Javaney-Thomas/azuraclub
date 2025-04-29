// "use client";
// import React from "react";
// import { useQuery, useMutation } from "@apollo/client";
// import {
//   UPDATE_CART_ITEM,
//   REMOVE_FROM_CART,
//   GET_CART,
// } from "@/app/shared/utils/queries";
// import Loader from "@/app/shared/components/Loader";
// import { ImgComp } from "@/app/shared/ImgComp";
// import { X } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { CartItem } from "../shared/type";

// interface CartData {
//   cart: CartItem[];
// }

// export default function Cart() {
//   const { data, loading, refetch } = useQuery<CartData>(GET_CART);

//   console.log(data, "data");

//   const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
//   const [removeFromCart] = useMutation(REMOVE_FROM_CART);

//   if (loading) return <Loader />;

//   const cartItems = data?.cart || [];
//   console.log(cartItems, "car");
//   const totalPrice = cartItems.reduce(
//     (sum, item) => sum + item.product.price * item.quantity,
//     0
//   );

//   const handleIncrement = async (itemId: string, currentQuantity: number) => {
//     await updateCartItem({
//       variables: { itemId, quantity: currentQuantity + 1 },
//     });
//     refetch();
//   };

//   const handleDecrement = async (itemId: string, currentQuantity: number) => {
//     if (currentQuantity <= 1) return;
//     await updateCartItem({
//       variables: { itemId, quantity: currentQuantity - 1 },
//     });
//     refetch();
//   };

//   const handleRemove = async (itemId: string) => {
//     await removeFromCart({ variables: { itemId } });
//     refetch();
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
//       {cartItems.length === 0 ? (
//         <p className="text-center text-gray-600">
//           Your cart is empty. Start shopping now!
//         </p>
//       ) : (
//         <div className="space-y-6">
//           {cartItems.map((item) => (
//             <div
//               key={item.id}
//               className="flex justify-between items-center border-b pb-4"
//             >
//               <div className="flex items-center">
//                 <ImgComp
//                   src={item.product.imageUrl}
//                   alt={item.product.title}
//                   className="w-16 h-16 rounded"
//                 />
//                 <div className="ml-4">
//                   <h3 className="text-lg font-medium">{item.product.title}</h3>
//                   <p className="text-gray-600">
//                     ${item.product.price.toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => handleDecrement(item.id, item.quantity)}
//                 >
//                   -
//                 </Button>
//                 <span className="font-bold">{item.quantity}</span>
//                 <Button
//                   variant="outline"
//                   onClick={() => handleIncrement(item.id, item.quantity)}
//                 >
//                   +
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={() => handleRemove(item.id)}
//                 >
//                   <X />
//                 </Button>
//               </div>
//             </div>
//           ))}
//           <div className="flex justify-between items-center mt-6">
//             <span className="text-xl font-bold">
//               Total: ${totalPrice.toFixed(2)}
//             </span>
//             <Link href="/checkout">
//               <Button className="bg-primaryx text-white px-6 py-3 rounded-lg cursor-pointer">
//                 Proceed to Checkout
//               </Button>
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  GET_CART,
  CREATE_CHECKOUT_SESSION,
} from "@/app/shared/utils/queries";
import Loader from "@/app/shared/components/Loader";
import { ImgComp } from "@/app/shared/ImgComp";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "../shared/type";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CartData {
  cart: CartItem[];
}

export default function Cart() {
  const { data, loading, refetch } = useQuery<CartData>(GET_CART);
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const [createCheckoutSession, { loading: checkoutLoading }] = useMutation(
    CREATE_CHECKOUT_SESSION
  );

  if (loading) return <Loader />;

  const cartItems = data?.cart || [];
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleIncrement = async (itemId: string, currentQuantity: number) => {
    await updateCartItem({
      variables: { itemId, quantity: currentQuantity + 1 },
    });
    refetch();
  };

  const handleDecrement = async (itemId: string, currentQuantity: number) => {
    if (currentQuantity <= 1) return;
    await updateCartItem({
      variables: { itemId, quantity: currentQuantity - 1 },
    });
    refetch();
  };

  const handleRemove = async (itemId: string) => {
    await removeFromCart({ variables: { itemId } });
    refetch();
  };

  const handleCheckout = async () => {
    // Format cart items as expected by your backend
    const formattedCartItems = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    try {
      const { data } = await createCheckoutSession({
        variables: { cartItems: formattedCartItems },
      });
      const sessionId = data.createCheckoutSession.sessionId;
      console.log({ sessionId }, "sessionId");
      const stripe = await stripePromise;
      const result = await stripe?.redirectToCheckout({ sessionId });
      if (result?.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">
          Your cart is empty. Start shopping now!
        </p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-4"
            >
              <div className="flex items-center">
                <ImgComp
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-16 h-16 rounded"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium">{item.product.title}</h3>
                  <p className="text-gray-600">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleDecrement(item.id, item.quantity)}
                >
                  -
                </Button>
                <span className="font-bold">{item.quantity}</span>
                <Button
                  variant="outline"
                  onClick={() => handleIncrement(item.id, item.quantity)}
                >
                  +
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRemove(item.id)}
                >
                  <X />
                </Button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <span className="text-xl font-bold">
              Total: ${totalPrice.toFixed(2)}
            </span>
            <Button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="bg-primaryx text-white px-6 py-3 rounded-lg cursor-pointer"
            >
              {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
