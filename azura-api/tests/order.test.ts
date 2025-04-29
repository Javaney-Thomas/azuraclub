import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app, { startApolloServer } from "../src/app";
import User from "../src/models/user.model";
import Product from "../src/models/product.model";
import Cart from "../src/models/cart.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../src/utils/jwt.util";

let mongoServer: MongoMemoryServer;
let httpServer: any;
let checkoutToken: string;
let productId: string;
let userId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  httpServer = await startApolloServer();

  // Create a checkout user.
  const user = await User.create({
    name: "Checkout User",
    email: "checkout@example.com",
    password: await bcrypt.hash("checkoutpass", 10),
    role: "user",
  });
  checkoutToken = generateToken(user);
  userId = user._id.toString();

  // Create a product.
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

  // Add product to cart.
  await Cart.create({
    user: userId,
    product: productId,
    quantity: 2,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  httpServer.close();
});

describe("Checkout Flow", () => {
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
      .set("Authorization", `Bearer ${checkoutToken}`)
      .send({ query: mutation });
    const order = response.body.data.checkoutCart;
    expect(order).toHaveProperty("id");
    expect(order.status).toBe("completed");
    expect(order.total).toBeGreaterThan(0);
  });

  it("should fail checkout when cart is empty", async () => {
    // Clear the cart first.
    await Cart.deleteMany({ user: userId });
    const mutation = `
      mutation {
        checkoutCart(paymentToken: "tok_visa") {
          id
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${checkoutToken}`)
      .send({ query: mutation });
    expect(response.body.errors[0].message).toBe(
      "Error during checkout: Cart is empty"
    );
  });

  it("should fail checkout with an invalid payment token", async () => {
    // Re-add an item to cart for this test.
    await Cart.create({
      user: userId,
      product: productId,
      quantity: 1,
    });
    const mutation = `
      mutation {
        checkoutCart(paymentToken: "invalid_token") {
          id
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${checkoutToken}`)
      .send({ query: mutation });
    expect(response.body.errors[0].message).toMatch(/Payment failed/);
  });
});
