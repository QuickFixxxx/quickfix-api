import { z } from "@hono/zod-openapi";
import { createAuthRoute } from "../../utils/wrappers/routeWrappers";

export const loginOrRegisterRoute = createAuthRoute({
  summary: "Login or Register a user",
  description:
    "Login a user if phone number exists, otherwise register a new user with the provided phone number.",
  method: "post",
  path: "/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            phoneNumber: z.string(),
          }),
          example: {
            phoneNumber: "9117937558",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "New User created",
      content: {
        "application/json": {
          schema: z.object({
            status: z.number(),
            data: z.object({}),
            message: z.string(),
          }),
          example: {
            status: 201,
            data: {},
            message: "new user created verify otp to continue",
          },
        },
      },
    },
    200: {
      description: "User exists, verify OTP to login",
      content: {
        "application/json": {
          schema: z.object({
            status: z.number(),
            data: z.object({}),
            message: z.string(),
          }),
          example: {
            status: 200,
            data: {},
            message: "user exists, verify otp to login",
          },
        },
      },
    },
  },
});
