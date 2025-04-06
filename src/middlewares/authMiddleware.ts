import { MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";
import { environmentVar } from "../config/env";
import redisClient from "../config/redis";

// Define payload type
type AccessTokenPayload = {
  userId: string;
  phoneNumber: string;
  type: "access";
  iat: number;
  exp: number;
};

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized: Token not provided" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    // Cast payload to your known type
    const payload = await verify(token, environmentVar.JWT_ACCESS_SECRET) as AccessTokenPayload;

    const userId = payload.userId;

    // Check Redis if token exists
    const storedToken = await redisClient.get(userId);
    if (!storedToken || storedToken !== token) {
      return c.json({ message: "Unauthorized: Invalid or expired token" }, 401);
    }

    // Attach user to context
    c.set("user", { id: userId, phone: payload.phoneNumber });

    await next();
  } catch (err) {
    console.error("JWT Error:", err);
    return c.json({ message: "Unauthorized: Token invalid" }, 401);
  }
};
