import { gql } from "graphql-tag";

export default gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    avatar: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    profile: User!
  }

  extend type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateProfile(name: String, email: String, avatar: String): User!
    forgotPassword(email: String!): String!
    resetPassword(resetToken: String!, newPassword: String!): String!
  }
`;
