CREATE TABLE "war_event" (
	"id" text PRIMARY KEY NOT NULL,
	"at" timestamp DEFAULT now() NOT NULL,
	"faction" text,
	"kind" text NOT NULL,
	"summary" text NOT NULL,
	"actor" text NOT NULL,
	"secret" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "war_faction" (
	"id" text PRIMARY KEY NOT NULL,
	"gold" bigint DEFAULT 75000 NOT NULL,
	"troops" integer DEFAULT 0 NOT NULL,
	"stone" integer DEFAULT 0 NOT NULL,
	"lumber" integer DEFAULT 0 NOT NULL,
	"faith" integer DEFAULT 0 NOT NULL,
	"fame" integer DEFAULT 0 NOT NULL,
	"trade" bigint DEFAULT 0 NOT NULL,
	"ap" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "war_movement" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"faction" text NOT NULL,
	"from_id" text NOT NULL,
	"to_id" text NOT NULL,
	"cargo" text DEFAULT '' NOT NULL,
	"troops" integer DEFAULT 0 NOT NULL,
	"departs_at" timestamp DEFAULT now() NOT NULL,
	"arrives_at" timestamp NOT NULL,
	"status" text DEFAULT 'moving' NOT NULL,
	"secret" boolean DEFAULT false NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "war_movement_kind" CHECK ("war_movement"."kind" in ('envoy', 'attack', 'ambush', 'raid')),
	CONSTRAINT "war_movement_status" CHECK ("war_movement"."status" in ('moving', 'arrived', 'won', 'lost', 'cancelled'))
);
--> statement-breakpoint
CREATE TABLE "war_setting" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "war_territory" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text,
	"tier" text DEFAULT 'town-hall' NOT NULL,
	"troops" integer DEFAULT 0 NOT NULL,
	"buildings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"obstacles" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "war_territory_tier" CHECK ("war_territory"."tier" in ('town-hall', 'castle', 'fortress'))
);
--> statement-breakpoint
CREATE INDEX "war_event_at_idx" ON "war_event" USING btree ("at");--> statement-breakpoint
CREATE INDEX "war_movement_status_idx" ON "war_movement" USING btree ("status");