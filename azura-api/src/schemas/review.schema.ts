import { gql } from "graphql-tag";

export default gql`
  scalar ObjectID

  type Review {
    id: ObjectID!
    user: User!
    product: Product!
    rating: Int!
    comment: String!
    createdAt: String!
  }

  extend type Query {
    # Fetch all reviews for a given product ID
    reviews(productId: ID!): [Review!]!
  }
  extend type Mutation {
    createReview(productId: ID!, rating: Int!, comment: String!): Review!
  }
`;
