import mongoose from "mongoose";
import env from "./env";

const connectDB = async () => {
  const dbURI = env.mongoURI;
  try {
    await mongoose.connect(dbURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
