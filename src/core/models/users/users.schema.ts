import {
  boolean,
  decimal,
  integer,
  jsonb,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { usersSchema } from "./base.schema";
import { relations } from "drizzle-orm";

export const userStatus = usersSchema.enum("user_status", [
  "invited", // Received invitation but not registered
  "not_verified", // Registered but not verified email/phone/documents
  "active", // Fully verified and active
  "suspended", // Temporary restrictions (can't use services temporarily)
  "deactivated", // User-initiated account closure
  "banned", // Permanent restrictions (can't use services permanently)
  "deleted", // Deleted account
]);

export const userGender = usersSchema.enum("user_gender", [
  "male",
  "female",
  "other",
]);

export const notificationModes = usersSchema.enum("notification_modes", [
  "push",
  "whatsapp",
  "email",
  "sms",
]);
export const userType = usersSchema.enum("user_types", [
  "contractor",
  "worker",
]);

export const workerAvailabilityEnum = usersSchema.enum("worker_availability", [
  "available",
  "busy",
  "unavailable",
]);

export const users = usersSchema.table("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  phoneNumber: text("phone_number").unique().notNull(),
  email: text("email").unique(),
  fullName: text("full_name"),
  userType: userType("user_type").notNull(),
  status: userStatus("status").default("invited"),
  isPhoneVerified: boolean("is_phone_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  profilePic: text("profile_pic").default("default"),
  age: integer("age"),
  gender: userGender("gender"),
  notificationPreferences: jsonb("notification_preferences")
    .$type<{
      push?: boolean;
      whatsapp?: boolean;
      email?: boolean;
      sms?: boolean;
    }>()
    .default({ push: true, whatsapp: false, email: false, sms: false }),
});

export const workerProfile = usersSchema.table("worker_profile", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  skills: jsonb("skills").array().default([]),
  experienceYears: integer("experience_years"),
  availability: workerAvailabilityEnum("availability").default("available"),
});

export const contractorProfile = usersSchema.table("contractor_profile", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  companyName: text("company_name"),
  companyAddress: text("company_address"),
  companyPhoneNumber: text("company_phone_number"),
  isVerified: boolean("is_verified").default(false),
  companyEmail: text("company_email"),
  companyWebsite: text("company_website"),
  specilizations: jsonb("specilizations").array().default([]),
  isCompanyVerified: boolean("is_company_verified").default(false),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneNumberVerified: boolean("is_phone_number_verified").default(false),
  startedIn: timestamp("started_in"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type WorkerProfile = typeof workerProfile.$inferSelect;
export type NewWorkerProfile = typeof workerProfile.$inferInsert;
export type ContractorProfile = typeof contractorProfile.$inferSelect;
export type NewContractorProfile = typeof contractorProfile.$inferInsert;

export const workerProfileRelations = relations(workerProfile, ({ one }) => ({
  user: one(users, {
    fields: [workerProfile.userId],
    references: [users.id],
  }),
}));

export const contractorProfileRelations = relations(
  contractorProfile,
  ({ one }) => ({
    user: one(users, {
      fields: [contractorProfile.userId],
      references: [users.id],
    }),
  })
);
