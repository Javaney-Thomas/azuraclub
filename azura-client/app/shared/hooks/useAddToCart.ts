// import { useMutation } from "@apollo/client";
// import { ADD_TO_CART, GET_CART } from "@/app/shared/utils/queries";

// export const useAddToCart = () => {
//   const [addToCart, { loading, error }] = useMutation(ADD_TO_CART, {
//     // Optimistic response to update the UI immediately.
//     // This assumes that the server returns a new list of cart items.
//     // Adjust as needed based on your server's response shape.
//     optimisticResponse: ({ productId, quantity }) => ({
//       addToCart: [
//         // You can either merge the new cart item into the existing ones
//         // or return a new array based on your logic.
//         {
//           __typename: "CartItem",
//           id: "temp-id", // temporary id for optimistic response
//           quantity: quantity,
//           product: {
//             __typename: "Product",
//             id: productId,
//             title: "", // If you have more info available, add here
//             price: 0,
//             imageUrl: "",
//           },
//         },
//       ],
//     }),
//     update(cache, { data: { addToCart } }) {
//       try {
//         // Read the existing cart from the cache
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const existingData: any = cache.readQuery({ query: GET_CART });
//         if (existingData && existingData.cart) {
//           // Here, we assume that your mutation returns the updated cart.
//           // You can merge the optimistic item into the existing cart array if needed.
//           cache.writeQuery({
//             query: GET_CART,
//             data: { cart: addToCart },
//           });
//         }
//       } catch (e) {
//         console.error("Error updating cache after addToCart:", e);
//       }
//     },
//   });
//   return { addToCart, loading, error };
// };

import { gql, useMutation } from "@apollo/client";

const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      id
      quantity
      product {
        id
        title
        price
        imageUrl
      }
    }
  }
`;

export const useAddToCart = () => {
  const [addToCart, { data, loading, error }] = useMutation(ADD_TO_CART);
  return { addToCart, data, loading, error };
};
