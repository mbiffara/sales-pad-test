CREATE TYPE "public"."job_status" AS ENUM('queued', 'processing', 'completed', 'failed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('send_lead_message', 'lead_reply_message', 'ai_reply_message');--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"boss_job_id" varchar(128) NOT NULL,
	"lead_id" integer,
	"message_id" integer,
	"type" "job_type" NOT NULL,
	"status" "job_status" DEFAULT 'queued' NOT NULL,
	"details" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE set null ON UPDATE no action;