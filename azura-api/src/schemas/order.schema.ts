import { gql } from "graphql-tag";

export default gql`
  type User {
    id: ID!
    email: String!
    name: String!
  }
  type OrderItem {
    product: Product!
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    user: User!
    items: [OrderItem!]!
    total: Float!
    status: String!
    createdAt: String!
  }

  type OrderResponse {
    order: Order!
    clientSecret: String!
  }
  extend type Query {
    orders: [Order!]!
    order(id: ID!): Order
    latestOrders(limit: Int): [Order!]!
    userOrders(userId: ID!): [Order!]!
  }

  extend type Mutation {
    # This mutation creates an order based on provided cart items and a payment method (dummy).
    createOrder(
      cartItems: [CartInput!]!
      paymentMethod: String!
    ): OrderResponse!
    # This mutation processes the authenticated user's entire cart using a payment token.
    checkoutCart(paymentToken: String!): Order!

    updateOrderStatus(orderId: ID!, status: String!): Order!
  }

  input CartInput {
    productId: ID!
    quantity: Int!
  }
`;
