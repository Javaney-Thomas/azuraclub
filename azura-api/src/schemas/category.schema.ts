import { gql } from "graphql-tag";

const categorySchema = gql`
  type Category {
    id: ID!
    name: String!
    description: String
  }

  extend type Query {
    categories: [Category]
  }

  extend type Mutation {
    createCategory(name: String!, description: String): Category
  }
`;

export default categorySchema;
