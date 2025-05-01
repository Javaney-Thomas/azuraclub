import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { gql } from "graphql-tag";
import { GraphQLUpload, graphqlUploadExpress } from "graphql-upload-ts";
import Stripe from "stripe";

import authSchema from "./schemas/auth.schema";
import productSchema from "./schemas/product.schema";
import cartSchema from "./schemas/cart.schema";
import orderSchema from "./schemas/order.schema";
import analyticsSchema from "./schemas/analytics.schema";
import userSchema from "./schemas/user.schema";
import contentSchema from "./schemas/content.schema";
import adminSchema from "./schemas/admin.schema";
import reviewSchema from "./schemas/review.schema";
import categorySchema from "./schemas/category.schema";

import authResolvers from "./resolvers/auth.resolver";
import productResolvers from "./resolvers/product.resolver";
import cartResolvers from "./resolvers/cart.resolver";
import orderResolvers from "./resolvers/order.resolver";
import analyticsResolvers from "./resolvers/analytics.resolver";
import userResolvers from "./resolvers/user.resolver";
import contentResolvers from "./resolvers/content.resolver";
import adminResolvers from "./resolvers/admin.resolver";
import reviewResolvers from "./resolvers/review.resolver";
import categoryResolvers from "./resolvers/category.resolver";

import { verifyToken } from "./utils/jwt.util";
import { createOrderAndClearCart } from "./services/orderService";
import userModel from "./models/user.model";
import { sendOrderConfirmationEmail } from "./services/sendOrderConfirmationEmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const baseTypeDefs = gql`
  scalar Upload
  scalar JSON

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  authSchema,
  productSchema,
  cartSchema,
  orderSchema,
  analyticsSchema,
  userSchema,
  contentSchema,
  adminSchema,
  reviewSchema,
  categorySchema,
]);

const resolvers = mergeResolvers([
  { Upload: GraphQLUpload },
  authResolvers,
  productResolvers,
  cartResolvers,
  orderResolvers,
  analyticsResolvers,
  userResolvers,
  contentResolvers,
  adminResolvers,
  reviewResolvers,
  categoryResolvers,
]);

const app = express();

app.use(cors({
  origin: "*",
  credentials: true,
}));

const httpServer = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Azura API is running 🚀");
});

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.sendStatus(400);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout session completed:", session.id);

      const userId = session.metadata?.userId;
      const cartItems = JSON.parse(session.metadata?.cartItems || "[]");

      try {
        const order = await createOrderAndClearCart(userId!, cartItems);
        const user = await userModel.findById(userId);
        if (user) {
          await sendOrderConfirmationEmail(user, order);
        }
        console.log("Order created and email sent:", order._id);
      } catch (err) {
        console.error("Error processing webhook:", err);
      }
    }

    res.json({ received: true });
  }
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: false,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  allowBatchedHttpRequests: true,
  status400ForVariableCoercionErrors: true,
});

export const startApolloServer = async () => {
  await server.start();

  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization
          ? req.headers.authorization.split(" ")[1]
          : "";
        let user = null;
        if (token) {
          try {
            user = verifyToken(token);
          } catch (error) {
            console.error("Invalid token:", error);
          }
        }
        return { user };
      },
    })
  );

  return httpServer;
};

export default app;
