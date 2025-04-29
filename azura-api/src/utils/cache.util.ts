import Redis from "ioredis";
import env from "../config/env";

const redis = new Redis(env.redisUrl || "redis://127.0.0.1:6379");

export const setCache = async (
  key: string,
  value: any,
  expiration: number
): Promise<void> => {
  await redis.set(key, JSON.stringify(value), "EX", expiration);
};

export const getCache = async (key: string): Promise<any> => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export default redis;
