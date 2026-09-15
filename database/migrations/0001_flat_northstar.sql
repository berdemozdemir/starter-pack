ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "deleted_at" timestamp with time zone;