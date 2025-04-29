import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { startApolloServer } from "../src/app"; // Our app.ts file exports startApolloServer
import User from "../src/models/user.model";
import Product from "../src/models/product.model";
import Cart from "../src/models/cart.model";
import Order from "../src/models/order.model";

// Increase Jest's timeout if needed (e.g., 30 seconds)
jest.setTimeout(30000);

let mongoServer: MongoMemoryServer;
let httpServer: any;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  // Start the Apollo Server (and Express app)
  httpServer = await startApolloServer();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  if (httpServer && httpServer.close) {
    httpServer.close();
  }
});

describe("Authentication Flow", () => {
  it("should register a new user and return a JWT", async () => {
    const mutation = `
      mutation {
        register(name: "Test User", email: "test@example.com", password: "password123") {
          token
          user {
            id
            email
            role
          }
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .send({ query: mutation });
    expect(response.body.data.register.token).toBeDefined();
    expect(response.body.data.register.user.email).toBe("test@example.com");
  });

  it("should log in an existing user", async () => {
    const mutation = `
      mutation {
        login(email: "test@example.com", password: "password123") {
          token
          user {
            id
            email
            role
          }
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .send({ query: mutation });
    expect(response.body.data.login.token).toBeDefined();
    expect(response.body.data.login.user.email).toBe("test@example.com");
  });
});

describe("Product Operations", () => {
  let authToken: string;
  let createdProductId: string;

  beforeAll(async () => {
    // Create an admin user for product operations
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: await require("bcryptjs").hash("adminpass", 10),
      role: "admin",
    });
    // Generate a JWT token for the admin user
    const { generateToken } = require("../src/utils/jwt.util");
    authToken = generateToken(admin);
  });

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
      .set("Authorization", `Bearer ${authToken}`)
      .send({ query: mutation });
    const product = response.body.data.createProduct;
    expect(product).toHaveProperty("id");
    expect(product.title).toBe("Test Product");
    createdProductId = product.id;
  });

  it("should fetch products with filtering and pagination", async () => {
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
});

describe("Checkout Flow", () => {
  let authToken: string;
  let productId: string;

  beforeAll(async () => {
    // Create a user and a product, then add product to cart.
    const user = await User.create({
      name: "Checkout User",
      email: "checkout@example.com",
      password: await require("bcryptjs").hash("checkoutpass", 10),
      role: "user",
    });
    const { generateToken } = require("../src/utils/jwt.util");
    authToken = generateToken(user);

    const product = await Product.create({
      title: "Checkout Product",
      description: "Product for checkout testing",
      price: 29.99,
      category: "Checkout",
      stock: 100,
      imageUrl: "http://example.com/checkout.jpg",
      approved: true,
    });
    productId = product._id.toString();

    // Add product to user's cart
    await require("../src/models/cart.model").default.create({
      user: user._id,
      product: productId,
      quantity: 2,
    });
  });

  it("should checkout the cart with a valid payment token", async () => {
    const mutation = `
      mutation {
        checkoutCart(paymentToken: "tok_visa") {
          id
          total
          status
          items {
            product {
              title
              price
            }
            quantity
            price
          }
          createdAt
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ query: mutation });
    const order = response.body.data.checkoutCart;
    expect(order).toHaveProperty("id");
    expect(order.status).toBe("completed");
    expect(order.total).toBeGreaterThan(0);
  });

  it("should fail checkout with an invalid payment token", async () => {
    const mutation = `
      mutation {
        checkoutCart(paymentToken: "invalid_token") {
          id
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ query: mutation });
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toMatch(/Payment failed/);
  });
});
