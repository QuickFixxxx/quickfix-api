import { defineConfig } from "drizzle-kit";
import { environmentVar } from "./src/config/env";
export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/core/models/*/*.schema.ts",
  schemaFilter: ["users"],
  dialect: "postgresql",
  dbCredentials: {
    url: environmentVar.DATABASE_URL,
    // url: "postgres://quickfix_user:quickfix_password@quickfixDb:5432/quickfixDb", // docker
  },
});
