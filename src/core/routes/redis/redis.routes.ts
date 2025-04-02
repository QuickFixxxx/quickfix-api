import { OpenAPIHono } from "@hono/zod-openapi";
import {
  redisSetTestRoute,
  redisTestRoute,
} from "../../../docs/redis/redis.docs";
import redisClient from "../../../config/redis";

const redisRoutes = new OpenAPIHono();

redisRoutes.openapi(redisTestRoute, async (c) => {
  const key = c.req.query("key");
  if (!key) {
    return c.json({ message: "Key is required" }, 400);
  }
  const value = await redisClient.get(key);
  return c.json({ value });
});

redisRoutes.openapi(redisSetTestRoute, async (c) => {
  const { key, value } = await c.req.json();
  await redisClient.set(key, value);
  return c.json({ message: "Data saved to Redis" });
});

export default redisRoutes;