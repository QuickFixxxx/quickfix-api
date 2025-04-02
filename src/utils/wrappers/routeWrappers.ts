import { createRoute, RouteConfig } from "@hono/zod-openapi";

type Tag = {
  name: string;
  description: string;
};

export const allTags: Record<string, Tag> = {
  auth: { name: "Auth", description: "authentication api docs" },
  redis: { name: "Redis", description: "redis testing route" },
  user: { name: "User", description: "user api docs" },
};

export const createAuthRoute = (
  config: RouteConfig
): ReturnType<typeof createRoute> => {
  return createRoute({
    ...config,
    tags: [allTags.auth.name],
  });
};

export const createUserRoute = (
  config: RouteConfig
): ReturnType<typeof createRoute> => {
  return createRoute({
    ...config,
    tags: [allTags.user.name],
  });
};

export const createRedisRoute = (
  config: RouteConfig
): ReturnType<typeof createRoute> => {
  return createRoute({
    ...config,
    tags: [allTags.redis.name],
  });
};
