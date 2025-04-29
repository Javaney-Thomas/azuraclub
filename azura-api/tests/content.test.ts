import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app, { startApolloServer } from "../src/app";
import User from "../src/models/user.model";
import Content from "../src/models/content.model";
import bcrypt from "bcryptjs";
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

describe("Content Operations", () => {
  let contentId: string;

  it("should create new content", async () => {
    const mutation = `
      mutation {
        updateContent(key: "homepage_banner", value: "Welcome to our homepage!") {
          id
          key
          value
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    const content = response.body.data.updateContent;
    expect(content.id).toBeDefined();
    expect(content.key).toBe("homepage_banner");
    expect(content.value).toBe("Welcome to our homepage!");
    contentId = content.id;
  });

  it("should retrieve content by key", async () => {
    const query = `
      query {
        content(key: "homepage_banner") {
          id
          key
          value
        }
      }
    `;
    const response = await request(httpServer).post("/graphql").send({ query });

    expect(response.body.data.content.key).toBe("homepage_banner");
    expect(response.body.data.content.value).toBe("Welcome to our homepage!");
  });

  it("should update existing content", async () => {
    const mutation = `
      mutation {
        updateContent(key: "homepage_banner", value: "Updated homepage message!") {
          id
          key
          value
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ query: mutation });

    const updatedContent = response.body.data.updateContent;
    expect(updatedContent.value).toBe("Updated homepage message!");
  });

  it("should throw an error when a non-admin tries to update content", async () => {
    // Create a non-admin user.
    const user = await User.create({
      name: "User",
      email: "user@example.com",
      password: await bcrypt.hash("userpass", 10),
      role: "user",
    });
    const userToken = generateToken(user);

    const mutation = `
      mutation {
        updateContent(key: "homepage_banner", value: "Unauthorized update attempt") {
          id
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ query: mutation });

    expect(response.body.errors[0].message).toBe("Not authorized");
  });
});
