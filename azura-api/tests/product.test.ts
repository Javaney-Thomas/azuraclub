import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app, { startApolloServer } from "../src/app";
import Product from "../src/models/product.model";
import bcrypt from "bcryptjs";
import User from "../src/models/user.model";
import { generateToken } from "../src/utils/jwt.util";

let mongoServer: MongoMemoryServer;
let httpServer: any;
let adminToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  httpServer = await startApolloServer();

  // Create an admin user and generate a token.
  const admin = await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: await bcrypt.hash("adminpass", 10),
    role: "admin",
  });
  adminToken = generateToken(admin);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  httpServer.close();
});

describe("Product Operations", () => {
  let productId: string;

  it("should create a new product", async () => {
    const mutation = `
      mutation {
        createProduct(
          title: "Test Product",
          description: "A product for testing",
          price: 19.99,
          category: "Testing",
          stock: 50,
          imageUrl: "http://example.com/image.jpg"
        ) {
          id
          title
          price
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    const product = response.body.data.createProduct;
    expect(product.id).toBeDefined();
    expect(product.title).toBe("Test Product");
    productId = product.id;
  });

  it("should fail to create a product with missing required fields", async () => {
    const mutation = `
      mutation {
        createProduct(
          description: "Missing title and category",
          price: 19.99,
          stock: 50,
          imageUrl: "http://example.com/image.jpg"
        ) {
          id
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });
    expect(response.body.errors[0].message).toMatch(/Missing required fields/);
  });

  it("should fetch products with filtering", async () => {
    const query = `
      query {
        products(category: "Testing", page: 1, limit: 10) {
          id
          title
        }
      }
    `;
    const response = await request(httpServer).post("/graphql").send({ query });
    expect(Array.isArray(response.body.data.products)).toBe(true);
    expect(response.body.data.products.length).toBeGreaterThan(0);
  });

  it("should update a product", async () => {
    const mutation = `
      mutation {
        updateProduct(id: "${productId}", price: 29.99) {
          id
          price
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });
    expect(response.body.data.updateProduct.price).toBe(29.99);
  });

  it("should delete a product", async () => {
    const mutation = `
      mutation {
        deleteProduct(id: "${productId}")
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });
    expect(response.body.data.deleteProduct).toBe(
      "Product deleted successfully"
    );
  });
});
