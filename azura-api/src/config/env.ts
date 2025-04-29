import dotenv from "dotenv";
dotenv.config();
// Define the type for the environment variables
type EnvVariables = {
  readonly ENV: "production" | "staging" | "development" | "test";
  readonly NODE_ENV: "production" | "development" | "test";
  readonly PORT: string;
  readonly MONGO_URI: string;
  readonly JWT_SECRET: string;
  readonly CLOUDINARY_CLOUD_NAME: string;
  readonly CLOUDINARY_API_KEY: string;
  readonly CLOUDINARY_API_SECRET: string;
  readonly SMTP_HOST: string;
  readonly SMTP_PORT: string;
  readonly SMTP_USER: string;
  readonly SMTP_PASS: string;
  // readonly SENTRY_DSN: string;
  readonly REDIS_URL: string;
};

// Helper function to retrieve and validate environment variables
let getEnv = (name: keyof EnvVariables): EnvVariables[keyof EnvVariables] => {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Cannot find environmental variable: ${name}`);
  }
  return val;
};

// Now we can define the environment configuration using the `getEnv` function
const env = {
  env: getEnv("ENV"),
  nodeEnv: getEnv("NODE_ENV"),
  port: getEnv("PORT"),
  mongoURI: getEnv("MONGO_URI"),
  jwtSecret: getEnv("JWT_SECRET"),
  cloudinary: {
    cloudName: getEnv("CLOUDINARY_CLOUD_NAME"),
    apiKey: getEnv("CLOUDINARY_API_KEY"),
    apiSecret: getEnv("CLOUDINARY_API_SECRET"),
  },
  smtp: {
    host: getEnv("SMTP_HOST"),
    port: getEnv("SMTP_PORT"),
    user: getEnv("SMTP_USER"),
    pass: getEnv("SMTP_PASS"),
  },
  // sentryDsn: getEnv("SENTRY_DSN"),
  redisUrl: getEnv("REDIS_URL"),
};

export default env;
