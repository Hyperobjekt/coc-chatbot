CREATE TABLE IF NOT EXISTS "CEParticipation" (
	"CEParticipationID" integer PRIMARY KEY NOT NULL,
	"ProjectID" integer,
	"AccessPoint" integer,
	"PreventionAssessment" integer,
	"CrisisAssessment" integer,
	"HousingAssessment" integer,
	"DirectServices" integer,
	"ReceivesReferrals" integer,
	"CEParticipationStatusStartDate" text,
	"CEParticipationStatusEndDate" text,
	"DateCreated" text,
	"DateUpdated" text,
	"UserID" integer,
	"DateDeleted" text,
	"ExportID" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CEParticipation" ADD CONSTRAINT "CEParticipation_ProjectID_Project_ProjectID_fk" FOREIGN KEY ("ProjectID") REFERENCES "public"."Project"("ProjectID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ce_participation_project_id_idx" ON "CEParticipation" USING btree ("ProjectID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ce_participation_export_id_idx" ON "CEParticipation" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ce_participation_start_date_idx" ON "CEParticipation" USING btree ("CEParticipationStatusStartDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ce_participation_end_date_idx" ON "CEParticipation" USING btree ("CEParticipationStatusEndDate");