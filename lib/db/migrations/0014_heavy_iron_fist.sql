CREATE TABLE IF NOT EXISTS "YouthEducationStatus" (
	"YouthEducationStatusID" text PRIMARY KEY NOT NULL,
	"EnrollmentID" integer,
	"PersonalID" integer,
	"InformationDate" text,
	"CurrentSchoolAttend" integer,
	"MostRecentEdStatus" integer,
	"CurrentEdStatus" integer,
	"DataCollectionStage" integer,
	"DateCreated" text,
	"DateUpdated" text,
	"UserID" integer,
	"DateDeleted" text,
	"ExportID" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "YouthEducationStatus" ADD CONSTRAINT "YouthEducationStatus_EnrollmentID_Enrollment_EnrollmentID_fk" FOREIGN KEY ("EnrollmentID") REFERENCES "public"."Enrollment"("EnrollmentID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "YouthEducationStatus" ADD CONSTRAINT "YouthEducationStatus_PersonalID_Client_PersonalID_fk" FOREIGN KEY ("PersonalID") REFERENCES "public"."Client"("PersonalID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "youth_education_status_enrollment_id_idx" ON "YouthEducationStatus" USING btree ("EnrollmentID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "youth_education_status_personal_id_idx" ON "YouthEducationStatus" USING btree ("PersonalID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "youth_education_status_export_id_idx" ON "YouthEducationStatus" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "youth_education_status_information_date_idx" ON "YouthEducationStatus" USING btree ("InformationDate");