import { createRoute } from "@hono/zod-openapi";

export const allTags = {
  auth: ["Auth"],
};

export const createAuthRoute = (config: Parameters<typeof createRoute>[0]) => {
  return createRoute({
    ...config,
    tags: allTags.auth,
  });
};
