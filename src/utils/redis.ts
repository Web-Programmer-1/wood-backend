import { createClient } from "redis";

let redis: any = null;

if (process.env.REDIS_URL) {
  redis = createClient({ url: process.env.REDIS_URL });

  redis.connect().catch((err: any) => {
    console.error("Redis connection failed:", err);
  });
}

export default redis;
