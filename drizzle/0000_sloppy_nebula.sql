CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone_number" varchar(32),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "lead_email_unique" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "lead_phone_unique" ON "leads" USING btree ("phone_number");