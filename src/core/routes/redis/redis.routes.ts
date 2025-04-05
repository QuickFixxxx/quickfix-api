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
  try {
    const value = await redisClient.get(key);
    return c.json({ value });
  } catch (err) {
    console.log(err);
    return c.json({ message: "something went wrong" });
  }
});

redisRoutes.openapi(redisSetTestRoute, async (c) => {
  const { key, value } = await c.req.json();
  try {
    await redisClient.set(key, value);
  } catch (err) {
    console.log("redis err", err);
  }
  return c.json({ message: "Data saved to Redis" });
});

export default redisRoutes;
