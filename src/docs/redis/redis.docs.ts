import { z } from "@hono/zod-openapi";
import { createRedisRoute } from "../../utils/wrappers/routeWrappers";

export const redisTestRoute = createRedisRoute({
  tags: ["redis"],
  summary: "Redis Test",
  description: "Test Redis connection",
  method: "get",
  path: "/redis-test",
  request: {
    query: z.object({
      key: z.string().openapi({
        example: "userName",
      }),
    }),
  },
  responses: {
    200: {
      description: "Redis Test",
      content: {
        "application/json": {
          schema: z.object({
            value: z.string().openapi({ example: "UNRIVALLEDKING" }),
          }),
        },
      },
    },
  },
});

export const redisSetTestRoute = createRedisRoute({
  tags: ["redis"],
  summary: "Redis Set Test",
  description: "Test Redis set connection",
  method: "post",
  path: "/redis-set-test",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            key: z.string().openapi({
              example: "userName",
            }),
            value: z.string().openapi({
              example: "UNRIVALLEDKING",
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Redis Set Test",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string().openapi({ example: "Data saved to Redis" }),
          }),
        },
      },
    },
  },
});
