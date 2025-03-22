CREATE SCHEMA "users";
--> statement-breakpoint
CREATE TYPE "users"."user_status" AS ENUM('invited', 'not_verified', 'active', 'suspended', 'deactivated', 'banned', 'deleted');--> statement-breakpoint
CREATE TABLE "users"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" text NOT NULL,
	"email" text,
	"full_name" text NOT NULL,
	"status" "users"."user_status" DEFAULT 'invited',
	"is_phone_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"profile_pic" text DEFAULT 'default',
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
