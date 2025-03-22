import { boolean, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersSchema } from "./base.schema";

export const userStatus = usersSchema.enum("user_status", [
  "invited", // Received invitation but not registered
  "not_verified", // Registered but not verified email/phone/documents
  "active", // Fully verified and active
  "suspended", // Temporary restrictions (can't use services temporarily)
  "deactivated", // User-initiated account closure
  "banned", // Permanent restrictions (can't use services permanently)
  "deleted", // Deleted account
]);

export const users = usersSchema.table("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  phoneNumber: text("phone_number").unique().notNull(),
  email: text("email").unique(),
  fullName: text("full_name").notNull(),
  status: userStatus("status").default("invited"),
  isPhoneVerified: boolean("is_phone_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  profilePic: text("profile_pic").default("default"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
