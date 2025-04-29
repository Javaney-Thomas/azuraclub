import winston from "winston";
// import Sentry from "@sentry/node";
import env from "../config/env";

// Optional: Initialize Sentry if a DSN is provided
// if (env.sentryDsn) {
//   Sentry.init({ dsn: env.sentryDsn });
// }

const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}] : ${message}`;
    if (Object.keys(metadata).length) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  }
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    logFormat
  ),
  defaultMeta: { service: "azura-backend" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export const logInfo = (msg: string, data?: any): void => {
  if (env.nodeEnv !== "test") {
    logger.info(msg, data);
  }
};

export const logError = (msg: string, error?: any): void => {
  logger.error(msg, error);
  // if (Sentry && error instanceof Error) {
  //   Sentry.captureException(error);
  // }
};

export default logger;
