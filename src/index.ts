import authRoutes from "./core/routes/auth/auth.routes";
import redisRoutes from "./core/routes/redis/redis.routes";
import {registerProtectedRoutes}  from "./core/routes/Authprotechted/protected.routes";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import serveEmojiFavicon from "./utils/serve-emoji-favicon";
import { readFileSync } from "fs";
import { resolve } from "path";
import { environmentVar } from "./config/env";
import { allTags } from "./utils/wrappers/routeWrappers";

type UserPayload = {
  id: string;
  phone: string;
};

type AppContext = {
  Variables: {
    user: UserPayload;
  };
};

const app = new OpenAPIHono<AppContext>({ strict: false });
// const app = new OpenAPIHono({ strict: false });

//middlewares
app.use(prettyJSON());
app.use(logger());
app.use(serveEmojiFavicon("⚡"));

const homePage = readFileSync(resolve(__dirname, "Home.html"), "utf8");
app.get("/", (c) => {
  return c.html(homePage, 200);
});
const baseApiRoute = "/api/v1";

// All Routes
app.route(`${baseApiRoute}/auth`, authRoutes);
app.route(`${baseApiRoute}/redis`, redisRoutes);

// 🔐 Protected routes
registerProtectedRoutes(app); // this will prefix all with `/api/protected/...`



app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "dev",
    title: "QuickFix API Docs",
    description: "Yahallo, nice to meet ya",
  },
  tags: Object.values(allTags),
  servers: [
    {
      url: `http://localhost:${environmentVar.PORT}`,
      description: "Local server",
    },
  ],
});

app.get(
  "/reference",
  apiReference({
    theme: "kepler",
    layout: "modern",
    pageTitle: "QuickFix API Docs",
    spec: { url: "/doc" },
  })
);


export default {
  port: environmentVar.PORT,
  fetch: app.fetch,
};
