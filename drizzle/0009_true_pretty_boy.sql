CREATE TABLE "profile_song" (
	"user_id" text PRIMARY KEY NOT NULL,
	"video_id" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wall_comment" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"author_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wall_post" (
	"id" text PRIMARY KEY NOT NULL,
	"wall_owner_id" text NOT NULL,
	"author_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_song" ADD CONSTRAINT "profile_song_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wall_comment" ADD CONSTRAINT "wall_comment_post_id_wall_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."wall_post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wall_comment" ADD CONSTRAINT "wall_comment_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wall_post" ADD CONSTRAINT "wall_post_wall_owner_id_user_id_fk" FOREIGN KEY ("wall_owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wall_post" ADD CONSTRAINT "wall_post_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "wall_comment_post_idx" ON "wall_comment" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "wall_comment_author_idx" ON "wall_comment" USING btree ("author_id","created_at");--> statement-breakpoint
CREATE INDEX "wall_post_owner_idx" ON "wall_post" USING btree ("wall_owner_id","created_at");--> statement-breakpoint
CREATE INDEX "wall_post_author_idx" ON "wall_post" USING btree ("author_id","created_at");