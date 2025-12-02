CREATE TABLE IF NOT EXISTS "DestinationLookup" (
	"Code" integer PRIMARY KEY NOT NULL,
	"Category" text NOT NULL,
	"Description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "HousingStatusLookup" (
	"Code" integer PRIMARY KEY NOT NULL,
	"Description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "LivingSituationLookup" (
	"Code" integer PRIMARY KEY NOT NULL,
	"Category" text NOT NULL,
	"Description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectTypeLookup" (
	"Code" integer PRIMARY KEY NOT NULL,
	"Description" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_LivingSituation_LivingSituationLookup_Code_fk" FOREIGN KEY ("LivingSituation") REFERENCES "public"."LivingSituationLookup"("Code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Exit" ADD CONSTRAINT "Exit_Destination_DestinationLookup_Code_fk" FOREIGN KEY ("Destination") REFERENCES "public"."DestinationLookup"("Code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Project" ADD CONSTRAINT "Project_ProjectType_ProjectTypeLookup_Code_fk" FOREIGN KEY ("ProjectType") REFERENCES "public"."ProjectTypeLookup"("Code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
