CREATE TYPE "public"."message_channel" AS ENUM('email');--> statement-breakpoint
CREATE TYPE "public"."message_sender" AS ENUM('system', 'lead');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('created', 'sent');--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer NOT NULL,
	"subject" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"channel" "message_channel" DEFAULT 'email' NOT NULL,
	"status" "message_status" DEFAULT 'created' NOT NULL,
	"sent_by" "message_sender" DEFAULT 'system' NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;