CREATE TABLE "upload" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"kind" text NOT NULL,
	"data" "bytea" NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "emblem_upload_id" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "banner_upload_id" text;--> statement-breakpoint
ALTER TABLE "upload" ADD CONSTRAINT "upload_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "upload_user_kind_idx" ON "upload" USING btree ("user_id","kind");--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_emblem_upload_id_upload_id_fk" FOREIGN KEY ("emblem_upload_id") REFERENCES "public"."upload"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_banner_upload_id_upload_id_fk" FOREIGN KEY ("banner_upload_id") REFERENCES "public"."upload"("id") ON DELETE set null ON UPDATE no action;