import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Import your models
import User, { IUser } from "../src/models/user.model";
import Product from "../src/models/product.model";
import Order from "../src/models/order.model";
import Cart from "../src/models/cart.model";
import Analytics from "../src/models/analytics.model";
import Review from "../src/models/review.model"; // Make sure this file exists

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Model Test", () => {
  it("should create & save a user successfully", async () => {
    const userData: Partial<IUser> = {
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
      role: "user",
    };

    const validUser = new User(userData);
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
  });
});

describe("Product Model Test", () => {
  it("should create & save a product successfully", async () => {
    const productData = {
      title: "Test Product",
      description: "Test Description",
      price: 10.99,
      category: "Test Category",
      stock: 100,
    };

    const validProduct = new Product(productData);
    const savedProduct = await validProduct.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.title).toBe(productData.title);
    expect(savedProduct.price).toBe(productData.price);
  });
});

describe("Order Model Test", () => {
  it("should create & save an order successfully", async () => {
    // Create a user
    const user = new User({
      name: "Order Test User",
      email: "order@test.com",
      password: "hashedpassword",
      role: "user",
    });
    await user.save();

    // Create a product
    const product = new Product({
      title: "Order Test Product",
      description: "Test Product Desc",
      price: 20.99,
      category: "Test Category",
      stock: 50,
    });
    await product.save();

    // Create an order with one order item
    const orderData = {
      user: user._id,
      items: [
        {
          product: product._id,
          quantity: 2,
          price: product.price,
        },
      ],
      total: product.price * 2,
      status: "pending",
    };

    const validOrder = new Order(orderData);
    const savedOrder = await validOrder.save();

    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.user.toString()).toBe(user._id.toString());
    expect(savedOrder.items.length).toBe(1);
    expect(savedOrder.total).toBeCloseTo(product.price * 2);
  });
});

describe("Cart Model Test", () => {
  it("should create & save a cart item successfully", async () => {
    // Create a user
    const user = new User({
      name: "Cart Test User",
      email: "cart@test.com",
      password: "hashedpassword",
      role: "user",
    });
    await user.save();

    // Create a product
    const product = new Product({
      title: "Cart Test Product",
      description: "Cart Product Desc",
      price: 15.99,
      category: "Test Category",
      stock: 30,
    });
    await product.save();

    const cartData = {
      user: user._id,
      product: product._id,
      quantity: 3,
    };

    const validCart = new Cart(cartData);
    const savedCart = await validCart.save();

    expect(savedCart._id).toBeDefined();
    expect(savedCart.quantity).toBe(3);
  });
});

describe("Analytics Model Test", () => {
  it("should create & save an analytics event successfully", async () => {
    const analyticsData = {
      event: "product_view",
      timestamp: new Date(), // Using a Date type now
      metadata: { ip: "127.0.0.1" },
    };

    const validAnalytics = new Analytics(analyticsData);
    const savedAnalytics = await validAnalytics.save();

    expect(savedAnalytics._id).toBeDefined();
    expect(savedAnalytics.event).toBe("product_view");
    expect(savedAnalytics.timestamp).toBeInstanceOf(Date);
  });
});

describe("Review Model Test", () => {
  it("should create & save a review successfully", async () => {
    // Create a user
    const user = new User({
      name: "Review Test User",
      email: "review@test.com",
      password: "hashedpassword",
      role: "user",
    });
    await user.save();

    // Create a product
    const product = new Product({
      title: "Review Test Product",
      description: "Review Product Desc",
      price: 12.99,
      category: "Test Category",
      stock: 25,
    });
    await product.save();

    // Create a review
    const reviewData = {
      user: user._id,
      product: product._id,
      rating: 4,
      comment: "Great product!",
    };

    const validReview = new Review(reviewData);
    const savedReview = await validReview.save();

    expect(savedReview._id).toBeDefined();
    expect(savedReview.rating).toBe(4);
    expect(savedReview.comment).toBe("Great product!");
  });
});
