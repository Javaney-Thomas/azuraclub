import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app, { startApolloServer } from "../src/app";
import User from "../src/models/user.model";
import Analytics from "../src/models/analytics.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../src/utils/jwt.util";

let mongoServer: MongoMemoryServer;
let httpServer: any;
let adminToken: string;
let userToken: string;

beforeAll(async () => {
  // Start in-memory MongoDB server
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
  });

  // Generate tokens for admin and user
  adminToken = generateToken(admin);
  userToken = generateToken(user);

  // Log some analytics events using valid ObjectId for productId
  await Analytics.create({
    event: "product_view",
    userId: user._id, // Reference valid userId
    productId: new mongoose.Types.ObjectId(), // Use a valid ObjectId for productId
    timestamp: new Date(),
  });
});

afterAll(async () => {
  // Disconnect MongoDB and stop the HTTP server
  await mongoose.disconnect();
  await mongoServer.stop();
  httpServer.close();
});

describe("Analytics Operations", () => {
  it("should fetch analytics data for admin", async () => {
    const query = `
      query {
        analyticsData {
          totalUsers
          totalProducts
          totalOrders
          productViews
          activeUsers
          mostViewedProducts {
            title
          }
        }
      }
    `;
    // Send GraphQL query as an admin
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query });

    // Ensure the response contains the expected fields
    expect(response.body.data.analyticsData).toHaveProperty("totalUsers");
    expect(response.body.data.analyticsData.productViews).toBeGreaterThan(0);
  });

  it("should not allow regular users to fetch analytics data", async () => {
    const query = `
      query {
        analyticsData {
          totalUsers
        }
      }
    `;
    // Send GraphQL query as a regular user
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ query });

    // Expect error due to unauthorized access
    expect(response.body.errors[0].message).toBe("Not authorized");
  });

  it("should log an event successfully", async () => {
    const mutation = `
      mutation {
        logEvent(
          event: "product_view", 
          userId: "${new mongoose.Types.ObjectId()}", 
          productId: "${new mongoose.Types.ObjectId()}", 
          metadata: { detail: "test" }, 
          timestamp: "${new Date().toISOString()}"
        ) {
          id
        }
      }
    `;
    // Send GraphQL mutation to log the event
    const response = await request(httpServer)
      .post("/graphql")
      .send({ query: mutation });

    // Ensure the event was logged successfully with an id
    expect(response.body.data.logEvent.id).toBeDefined();
  });
});
