import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app, { startApolloServer } from "../src/app";
import User from "../src/models/user.model";
import Cart from "../src/models/cart.model";
import Product from "../src/models/product.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../src/utils/jwt.util";

let mongoServer: MongoMemoryServer;
let httpServer: any;
let userToken: string;
let productId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  httpServer = await startApolloServer();

  // Create a user and product.
  const user = await User.create({
    name: "Cart User",
    email: "cartuser@example.com",
    password: await bcrypt.hash("cartpass", 10),
    role: "user",
  });
  userToken = generateToken(user);

  const product = await Product.create({
    title: "Cart Product",
    description: "Product for cart testing",
    price: 49.99,
    category: "Testing",
    stock: 100,
    approved: true,
  });
  productId = product._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  httpServer.close();
});

describe("Cart Operations", () => {
  it("should add a product to the cart", async () => {
    const mutation = `
      mutation {
        addToCart(productId: "${productId}", quantity: 2) {
          id
          product {
            title
          }
          quantity
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ query: mutation });
    expect(response.body.data.addToCart[0].quantity).toBe(2);
  });

  it("should update a cart item", async () => {
    // Get current cart items.
    let cartResponse = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ query: `{ cart { id quantity } }` });
    const itemId = cartResponse.body.data.cart[0].id;

    const mutation = `
      mutation {
        updateCartItem(itemId: "${itemId}", quantity: 5) {
          id
          quantity
        }
      }
    `;
    cartResponse = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ query: mutation });
    expect(cartResponse.body.data.updateCartItem.quantity).toBe(5);
  });

  it("should remove a cart item", async () => {
    // Get current cart items.
    let cartResponse = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ query: `{ cart { id } }` });
    const itemId = cartResponse.body.data.cart[0].id;

    const mutation = `
      mutation {
        removeFromCart(itemId: "${itemId}") {
          id
        }
      }
    `;
    cartResponse = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ query: mutation });
    expect(cartResponse.body.data.removeFromCart.length).toBe(0);
  });

  it("should merge a guest cart into user cart", async () => {
    // Create a guest cart item.
    const guestCart = [
      { productId, quantity: 3 },
      { productId, quantity: 2 },
    ];
    const mutation = `
      mutation {
        mergeCart(guestCart: [ { productId: "${productId}", quantity: 3 }, { productId: "${productId}", quantity: 2 } ])
        {
          id
          quantity
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ query: mutation });
    // Expect the quantities to be merged.
    expect(response.body.data.mergeCart[0].quantity).toBe(5);
  });

  it("should bulk update multiple cart items", async () => {
    // First, add a cart item.
    let addResponse = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        query: `mutation { addToCart(productId: "${productId}", quantity: 4) { id quantity } }`,
      });
    const itemId = addResponse.body.data.addToCart[0].id;

    const mutation = `
      mutation {
        updateMultipleCartItems(cartItems: [{ itemId: "${itemId}", quantity: 7 }]) {
          id
          quantity
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ query: mutation });
    expect(response.body.data.updateMultipleCartItems[0].quantity).toBe(7);
  });
});
