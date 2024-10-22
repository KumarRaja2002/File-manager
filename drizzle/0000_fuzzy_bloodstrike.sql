DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('active', 'archieved');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('image', 'media', 'document', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description" text,
	"status" "status" DEFAULT 'active',
	"created_by" integer,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"name" varchar NOT NULL,
	"mime_type" varchar NOT NULL,
	"size" integer NOT NULL,
	"path" varchar NOT NULL,
	"uploaded_at" timestamp DEFAULT now(),
	"uploaded_by" integer,
	"status" "status" DEFAULT 'active',
	"category_id" integer NOT NULL,
	"type" "type" NOT NULL,
	"tags" json DEFAULT '[]'::json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"password" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "category_id_idx" ON "files" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "type_idx" ON "files" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");