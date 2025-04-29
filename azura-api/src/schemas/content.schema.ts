import { gql } from "graphql-tag";

export default gql`
  type Content {
    id: ID!
    key: String!
    value: String!
    updatedAt: String!
  }

  extend type Query {
    # Retrieve a specific content entry by key (admin only)
    content(key: String!): Content
    # Retrieve all content entries (admin only)
    allContent: [Content!]!
  }

  extend type Mutation {
    # Update (or create) content with the given key and value (admin only)
    updateContent(key: String!, value: String!): Content!
  }
`;
