import { gql } from "graphql-tag";

export default gql`
  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    updateUserRole(id: ID!, role: String!): User!
    deleteUser(id: ID!): String!
  }
`;
