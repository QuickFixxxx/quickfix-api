import authRoutes from "./core/routes/auth/auth.routes";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import serveEmojiFavicon from "./utils/serve-emoji-favicon";
import { readFileSync } from "fs";
import { resolve } from "path";
import { environmentVar } from "./config/env";

const app = new OpenAPIHono({ strict: false });

app.use(prettyJSON());
app.use(logger());
app.use(serveEmojiFavicon("⚡"));

const homePage = readFileSync(resolve(__dirname, "Home.html"), "utf8");
app.get("/", (c) => {
  return c.html(homePage, 200);
});

const baseApiRoute = "/api/v1";
app.route(`${baseApiRoute}/auth`, authRoutes);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "dev",
    title: "QuickFix API Docs",
  },
  tags: [],
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
    // theme: "saturn",
    theme: "kepler",
    layout: "modern",
    // layout: "classic",
    pageTitle: "QuickFix API Docs",

    spec: { url: "/doc" },
  })
);
export default {
  port: environmentVar.PORT,
  fetch: app.fetch,
};
