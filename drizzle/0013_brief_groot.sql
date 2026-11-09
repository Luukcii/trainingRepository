CREATE TABLE "staff_command" (
	"id" text PRIMARY KEY NOT NULL,
	"discord_id" text NOT NULL,
	"at" timestamp DEFAULT now() NOT NULL,
	"command" text NOT NULL,
	"allowed" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE INDEX "staff_command_discord_at_idx" ON "staff_command" USING btree ("discord_id","at");--> statement-breakpoint
CREATE INDEX "staff_command_at_idx" ON "staff_command" USING btree ("at");