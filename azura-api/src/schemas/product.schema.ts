import { gql } from "graphql-tag";

export default gql`
  scalar Upload

  type Product {
    id: ID!
    title: String!
    description: String
    price: Float!
    category: String!
    stock: Int!
    imageUrl: String!
    # createdAt: DateTime!
    # updatedAt: DateTime!
  }

  input ProductCreateInput {
    title: String!
    description: String
    price: Float!
    category: String!
    stock: Int!
  }

  input ProductUpdateInput {
    title: String
    description: String
    price: Float
    category: String
    stock: Int
  }

  extend type Query {
    # Retrieve a list of products with optional filtering and pagination.
    products(
      category: String
      search: String
      page: Int
      limit: Int
    ): [Product!]!
    # Total number of products matching the filter.
    productsCount(category: String, search: String): Int!
    # Retrieve a single product by ID.
    product(id: ID!): Product
  }

  extend type Mutation {
    # Create a new product with an image file. Only accessible to admins or vendors.
    createProduct(file: Upload!, input: ProductCreateInput!): Product!

    # Update an existing product. Only accessible to admins or vendors.
    updateProduct(id: ID!, file: Upload, input: ProductUpdateInput!): Product!

    # Delete a product. Only accessible to admins.
    deleteProduct(id: ID!): Product!

    # Upload an image file for a product.
    uploadProductImage(file: Upload!): String!

    # Update product image separately.
    updateProductImage(id: ID!, file: Upload!): Product!
  }
`;
