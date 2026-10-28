CREATE TABLE "invite" (
	"id" text PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"created_by" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"used_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invite_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "invite" ADD CONSTRAINT "invite_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite" ADD CONSTRAINT "invite_used_by_user_id_fk" FOREIGN KEY ("used_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;