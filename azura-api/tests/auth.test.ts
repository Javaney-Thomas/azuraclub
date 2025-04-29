import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app, { startApolloServer } from "../src/app";

// Mock sendEmail so it resolves immediately.
jest.mock("../src/utils/mailer.util", () => ({
  sendEmail: jest.fn(() => Promise.resolve("Email sent")),
}));

let mongoServer: MongoMemoryServer;
let httpServer: any;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  httpServer = await startApolloServer();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  httpServer.close();
});

describe("Auth Flow", () => {
  // Registration tests
  it("should register a user successfully", async () => {
    const mutation = `
      mutation {
        register(name: "Test User", email: "obadeyi01@gmail.com", password: "password123") {
          token
          user {
            id
            name
            email
          }
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .send({ query: mutation });

    expect(response.body.data.register.token).toBeDefined();
    expect(response.body.data.register.user.email).toBe("obadeyi01@gmail.com");
  });

  it("should fail to register a user with an existing email", async () => {
    const mutation = `
      mutation {
        register(name: "Test User", email: "obadeyi01@gmail.com", password: "password123") {
          token
          user {
            id
            name
            email
          }
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .send({ query: mutation });

    expect(response.body.errors[0].message).toBe(
      "Error during registration: User already exists"
    );
  });

  // Login tests
  it("should login a user successfully and return a JWT token", async () => {
    const mutation = `
      mutation {
        login(email: "obadeyi01@gmail.com", password: "password123") {
          token
          user {
            id
            name
            email
          }
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .send({ query: mutation });

    expect(response.body.data.login.token).toBeDefined();
    expect(response.body.data.login.user.email).toBe("obadeyi01@gmail.com");
  });

  it("should fail to login with incorrect password", async () => {
    const mutation = `
      mutation {
        login(email: "obadeyi01@gmail.com", password: "wrongpassword") {
          token
          user {
            id
            name
            email
          }
        }
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .send({ query: mutation });

    expect(response.body.errors[0].message).toBe(
      "Error during login: Invalid password"
    );
  });

  // Forgot Password tests
  it("should send a forgot password email", async () => {
    const mutation = `
      mutation {
        forgotPassword(email: "obadeyi01@gmail.com")
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .send({ query: mutation });

    expect(response.body.data.forgotPassword).toBe(
      "If that email address is in our system, we have sent a password reset link."
    );
  }, 10000);

  it("should return the same message for non-existent email in forgotPassword", async () => {
    const mutation = `
      mutation {
        forgotPassword(email: "nonexistent@gmail.com")
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .send({ query: mutation });

    expect(response.body.data.forgotPassword).toBe(
      "If that email address is in our system, we have sent a password reset link."
    );
  });

  // Reset Password tests
  it("should fail to reset password with an invalid token", async () => {
    // No selection set since the mutation returns a String.
    const mutation = `
      mutation {
        resetPassword(resetToken: "invalidtoken", newPassword: "newpassword123")
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .send({ query: mutation });

    // Adjusted expectation to include our error prefix.
    expect(response.body.errors[0].message).toBe(
      "Error resetting password: Password reset token is invalid or has expired"
    );
  });

  it("should successfully reset password with a valid token", async () => {
    // Manually set a valid reset token on the user.
    const User = require("../src/models/user.model").default;
    const user = await User.findOne({ email: "obadeyi01@gmail.com" });
    const validToken = "valid_reset_token";
    user.resetPasswordToken = validToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Expires in 1 hour
    await user.save();

    const mutation = `
      mutation {
        resetPassword(resetToken: "${validToken}", newPassword: "newpassword123")
      }
    `;
    const response = await request(httpServer)
      .post("/graphql")
      .send({ query: mutation });

    expect(response.body.data.resetPassword).toBe(
      "Password has been reset successfully"
    );
  });
});
