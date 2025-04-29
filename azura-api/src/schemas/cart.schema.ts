import { gql } from "graphql-tag";

export default gql`
  type CartItem {
    id: ID!
    product: Product!
    quantity: Int!
  }

  input CartInput {
    productId: ID!
    quantity: Int!
  }

  input UpdateCartItemInput {
    itemId: ID!
    quantity: Int!
  }

  extend type Query {
    # Retrieve the authenticated user's cart items.
    cart: [CartItem!]!
  }

  extend type Mutation {
    # Add a product to the cart or update the quantity if it already exists.
    addToCart(productId: ID!, quantity: Int!): [CartItem!]!

    # Update the quantity of a specific cart item.
    updateCartItem(itemId: ID!, quantity: Int!): CartItem!

    # Remove a product from the cart.
    removeFromCart(itemId: ID!): [CartItem!]!

    # Merge a guest cart (client-side cart) into the authenticated user's cart.
    mergeCart(guestCart: [CartInput!]!): [CartItem!]!

    # Bulk update multiple cart items in one mutation.
    updateMultipleCartItems(cartItems: [UpdateCartItemInput!]!): [CartItem!]!
  }
`;
