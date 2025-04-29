import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app, { startApolloServer } from "../src/app";
import User from "../src/models/user.model";
import Product from "../src/models/product.model";
import Order from "../src/models/order.model";
import Analytics from "../src/models/analytics.model"; // Added Analytics model
import bcrypt from "bcryptjs";
import { generateToken } from "../src/utils/jwt.util";

let mongoServer: MongoMemoryServer;
let httpServer: any;
let adminToken: string;
let userToken: string;
let productId: string;
let invalidProductId = "609e1234567890abcdef1234"; // Simulated invalid ID

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  httpServer = await startApolloServer();

  // Create admin and user
  const admin = await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: await bcrypt.hash("adminpass", 10),
    role: "admin",
  });

  const user = await User.create({
    name: "User",
    email: "user@example.com",
    password: await bcrypt.hash("userpass", 10),
    role: "user",
    suspended: false, // User starts active
  });

  adminToken = generateToken(admin);
  userToken = generateToken(user);

  // Create product
  const product = await Product.create({
    title: "Admin Product",
    description: "Product for admin testing",
    price: 49.99,
    category: "Admin",
    stock: 100,
    approved: false, // Initially not approved
  });

  productId = product._id.toString();

  // Log analytics data
  await Analytics.create({
    event: "product_view",
    userId: user._id,
    productId: productId,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  httpServer.close();
});

describe("Admin Operations", () => {
  let userId: string;

  beforeEach(async () => {
    const user = await User.findOne({ email: "user@example.com" });
    userId = user ? user._id.toString() : "";
  });

  // --- User Role Tests ---
  it("should update a user's role to admin", async () => {
    const mutation = `
      mutation {
        updateUserRole(id: "${userId}", role: "admin") {
          id
          role
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    expect(response.body.data.updateUserRole.role).toBe("admin");
  });

  it("should throw error if trying to update role of non-existent user", async () => {
    const mutation = `
      mutation {
        updateUserRole(id: "invalidUserId", role: "admin") {
          id
          role
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    expect(response.body.errors[0].message).toBe("Invalid User ID");
  });

  it("should suspend a user", async () => {
    const mutation = `
      mutation {
        suspendUser(id: "${userId}") {
          id
          suspended
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    expect(response.body.data.suspendUser.suspended).toBe(true);
  });

  it("should unsuspend a user", async () => {
    const mutation = `
      mutation {
        unsuspendUser(id: "${userId}") {
          id
          suspended
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    expect(response.body.data.unsuspendUser.suspended).toBe(false);
  });

  it("should throw error if trying to suspend a non-existent user", async () => {
    const mutation = `
      mutation {
        suspendUser(id: "invalidUserId") {
          id
          suspended
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    expect(response.body.errors[0].message).toBe("Invalid User ID");
  });

  it("should delete a user", async () => {
    const mutation = `
      mutation {
        deleteUser(id: "${userId}")
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    expect(response.body.data.deleteUser).toBe("User deleted successfully");
  });

  it("should throw error when deleting non-existent user", async () => {
    const mutation = `
      mutation {
        deleteUser(id: "invalidUserId")
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    expect(response.body.errors[0].message).toBe("Invalid User ID");
  });

  // --- Product Moderation Tests ---
  it("should approve a product", async () => {
    const mutation = `
      mutation {
        approveProduct(productId: "${productId}") {
          id
          approved
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    expect(response.body.data.approveProduct.approved).toBe(true);
  });

  it("should reject a product", async () => {
    const mutation = `
      mutation {
        rejectProduct(productId: "${productId}") {
          id
          approved
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    expect(response.body.data.rejectProduct.approved).toBe(false);
  });

  it("should throw error if trying to approve a non-existent product", async () => {
    const mutation = `
      mutation {
        approveProduct(productId: "invalidProductId") {
          id
          approved
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    expect(response.body.errors[0].message).toBe("Invalid Product ID");
  });

  // --- Order Management Tests ---
  it("should update an order's status", async () => {
    const order = await Order.create({
      user: userId,
      status: "pending",
      total: 100,
      items: [],
    });

    const mutation = `
      mutation {
        updateOrderStatus(orderId: "${order._id}", status: "completed") {
          id
          status
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    expect(response.body.data.updateOrderStatus.status).toBe("completed");
  });

  it("should throw error when updating status of non-existent order", async () => {
    const mutation = `
      mutation {
        updateOrderStatus(orderId: "invalidOrderId", status: "completed") {
          id
          status
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    expect(response.body.errors[0].message).toBe("Invalid Order ID");
  });

  // --- Admin Dashboard Tests ---
  it("should fetch admin dashboard metrics", async () => {
    const query = `
      query {
        adminDashboard {
          totalUsers
          totalProducts
          totalOrders
          totalRevenue
          averageCartValue
          mostViewedProducts {
            _id
          }
          conversionRate
          lowStockProducts {
            title
          }
          cancellationRate
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query });

    const dashboard = response.body.data.adminDashboard;
    expect(dashboard.totalUsers).toBeGreaterThan(0);
    expect(dashboard.totalProducts).toBeGreaterThan(0);
    expect(dashboard.totalOrders).toBeGreaterThan(0);
    expect(dashboard.totalRevenue).toBeGreaterThan(0);
    expect(dashboard.mostViewedProducts.length).toBeGreaterThan(0);
    expect(dashboard.conversionRate).toBeGreaterThan(0);
    expect(dashboard.lowStockProducts.length).toBe(0); // Assuming no low stock
    expect(dashboard.cancellationRate).toBe(0); // Assuming no canceled orders
  });

  // Test unauthorized access
  it("should not allow regular users to access admin dashboard", async () => {
    const query = `
      query {
        adminDashboard {
          totalUsers
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ query });

    expect(response.body.errors[0].message).toBe("Not authorized");
  });
});
