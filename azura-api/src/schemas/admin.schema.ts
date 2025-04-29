import { gql } from "graphql-tag";

export default gql`
  type AdminDashboardData {
    totalUsers: Int!
    activeUsers: Int!
    totalProducts: Int!
    totalOrders: Int!
    totalRevenue: Float!
    averageCartValue: Float!
    mostViewedProducts: [Product!]!
    mostSearchedProducts: [String!]!
    conversionRate: Float!
    lowStockProducts: [Product!]!
    cancellationRate: Float!
  }

  extend type Query {
    adminDashboard: AdminDashboardData!
    users: [User!]!
    content(key: String!): Content
  }

  extend type Mutation {
    updateUserRole(id: ID!, role: String!): User!
    suspendUser(id: ID!): User!
    unsuspendUser(id: ID!): User!
    deleteUser(id: ID!): String!
    approveProduct(productId: ID!): Product!
    rejectProduct(productId: ID!): Product!
    updateOrderStatus(orderId: ID!, status: String!): Order!
    updateContent(key: String!, value: String!): Content!
  }
`;
