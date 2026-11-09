CREATE TABLE "god_chat" (
	"id" text PRIMARY KEY NOT NULL,
	"discord_id" text NOT NULL,
	"turns" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "god_chat_updated_idx" ON "god_chat" USING btree ("updated_at");