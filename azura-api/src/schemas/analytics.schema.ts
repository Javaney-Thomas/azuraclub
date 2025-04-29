import { gql } from "graphql-tag";

export default gql`
  type AnalyticsData {
    totalUsers: Int!
    totalProducts: Int!
    totalOrders: Int!
    productViews: Int!
    activeUsers: Int!
    mostViewedProducts: [Product!]!
  }

  type Analytics {
    id: ID!
    event: String!
    userId: ID
    productId: ID
    metadata: JSON
    timestamp: String!
  }

  extend type Query {
    # Aggregated analytics data (admin only)
    analyticsData: AnalyticsData!
  }

  extend type Mutation {
    # Log an event with the specified data.
    logEvent(
      event: String!
      userId: ID
      productId: ID
      metadata: JSON
      timestamp: String!
    ): Analytics!
  }
`;
