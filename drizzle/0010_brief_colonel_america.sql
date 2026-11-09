CREATE TABLE "god_question" (
	"id" text PRIMARY KEY NOT NULL,
	"discord_id" text NOT NULL,
	"at" timestamp DEFAULT now() NOT NULL,
	"model" text NOT NULL,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"cached_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX "god_question_discord_at_idx" ON "god_question" USING btree ("discord_id","at");--> statement-breakpoint
CREATE INDEX "god_question_at_idx" ON "god_question" USING btree ("at");