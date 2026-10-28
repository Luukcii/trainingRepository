CREATE TABLE "review" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"project_slug" text NOT NULL,
	"approval" integer NOT NULL,
	"comment" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "review_approval_range" CHECK ("review"."approval" BETWEEN 0 AND 100)
);
--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "review_user_project_idx" ON "review" USING btree ("user_id","project_slug");--> statement-breakpoint
CREATE INDEX "review_project_idx" ON "review" USING btree ("project_slug");