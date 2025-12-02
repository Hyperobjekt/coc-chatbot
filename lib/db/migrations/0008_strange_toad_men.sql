CREATE TABLE IF NOT EXISTS "Assessment" (
	"AssessmentID" integer PRIMARY KEY NOT NULL,
	"EnrollmentID" integer,
	"PersonalID" integer,
	"AssessmentDate" timestamp,
	"AssessmentLocation" integer,
	"AssessmentType" integer,
	"AssessmentLevel" integer,
	"PrioritizationStatus" integer,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Client" (
	"PersonalID" integer PRIMARY KEY NOT NULL,
	"FirstName" text,
	"MiddleName" text,
	"LastName" text,
	"NameSuffix" text,
	"NameDataQuality" integer,
	"SSN" text,
	"SSNDataQuality" integer,
	"DOB" timestamp,
	"DOBDataQuality" integer,
	"AmIndAKNative" integer,
	"Asian" integer,
	"BlackAfAmerican" integer,
	"HispanicLatinaeo" integer,
	"MidEastNAfrican" integer,
	"NativeHIPacific" integer,
	"White" integer,
	"RaceNone" integer,
	"AdditionalRaceEthnicity" text,
	"Woman" integer,
	"Man" integer,
	"NonBinary" integer,
	"CulturallySpecific" integer,
	"Transgender" integer,
	"Questioning" integer,
	"DifferentIdentity" integer,
	"GenderNone" integer,
	"DifferentIdentityText" text,
	"VeteranStatus" integer,
	"YearEnteredService" integer,
	"YearSeparated" integer,
	"WorldWarII" integer,
	"KoreanWar" integer,
	"VietnamWar" integer,
	"DesertStorm" integer,
	"AfghanistanOEF" integer,
	"IraqOIF" integer,
	"IraqOND" integer,
	"OtherTheater" integer,
	"MilitaryBranch" integer,
	"DischargeStatus" integer,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CurrentLivingSituation" (
	"CurrentLivingSitID" integer PRIMARY KEY NOT NULL,
	"EnrollmentID" integer,
	"PersonalID" integer,
	"InformationDate" timestamp,
	"CurrentLivingSituation" integer,
	"CLSSubsidyType" text,
	"VerifiedBy" text,
	"LeaveSituation14Days" integer,
	"SubsequentResidence" integer,
	"ResourcesToObtain" integer,
	"LeaseOwn60Day" integer,
	"MovedTwoOrMore" integer,
	"LocationDetails" text,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "EmploymentEducation" (
	"EmploymentEducationID" text PRIMARY KEY NOT NULL,
	"EnrollmentID" integer,
	"PersonalID" integer,
	"InformationDate" timestamp,
	"LastGradeCompleted" integer,
	"SchoolStatus" integer,
	"Employed" integer,
	"EmploymentType" integer,
	"NotEmployedReason" integer,
	"DataCollectionStage" integer,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Enrollment" (
	"EnrollmentID" integer PRIMARY KEY NOT NULL,
	"PersonalID" integer,
	"ProjectID" integer,
	"EntryDate" timestamp,
	"HouseholdID" text,
	"RelationshipToHoH" integer,
	"EnrollmentCoC" text,
	"LivingSituation" integer,
	"RentalSubsidyType" integer,
	"LengthOfStay" integer,
	"LOSUnderThreshold" integer,
	"PreviousStreetESSH" integer,
	"DateToStreetESSH" timestamp,
	"TimesHomelessPastThreeYears" integer,
	"MonthsHomelessPastThreeYears" integer,
	"DisablingCondition" integer,
	"DateOfEngagement" timestamp,
	"MoveInDate" timestamp,
	"DateOfPATHStatus" timestamp,
	"ClientEnrolledInPATH" integer,
	"ReasonNotEnrolled" integer,
	"PercentAMI" integer,
	"ReferralSource" integer,
	"CountOutreachReferralApproaches" integer,
	"DateOfBCPStatus" timestamp,
	"EligibleForRHY" integer,
	"ReasonNoServices" integer,
	"RunawayYouth" integer,
	"SexualOrientation" integer,
	"SexualOrientationOther" text,
	"FormerWardChildWelfare" integer,
	"ChildWelfareYears" integer,
	"ChildWelfareMonths" integer,
	"FormerWardJuvenileJustice" integer,
	"JuvenileJusticeYears" integer,
	"JuvenileJusticeMonths" integer,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Event" (
	"EventID" integer PRIMARY KEY NOT NULL,
	"EnrollmentID" integer,
	"PersonalID" integer,
	"EventDate" timestamp,
	"Event" integer,
	"ProbSolDivRRResult" integer,
	"ReferralCaseManageAfter" integer,
	"LocationCrisisOrPHHousing" text,
	"ReferralResult" integer,
	"ResultDate" timestamp,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Exit" (
	"ExitID" integer PRIMARY KEY NOT NULL,
	"EnrollmentID" integer,
	"PersonalID" integer,
	"ExitDate" timestamp,
	"Destination" integer,
	"DestinationSubsidyType" integer,
	"OtherDestination" text,
	"HousingAssessment" integer,
	"SubsidyInformation" integer,
	"ProjectCompletionStatus" integer,
	"EarlyExitReason" integer,
	"ExchangeForSex" integer,
	"ExchangeForSexPastThreeMonths" integer,
	"CountOfExchangeForSex" integer,
	"AskedOrForcedToExchangeForSex" integer,
	"WorkplaceViolenceThreats" integer,
	"WorkplacePromiseDifference" integer,
	"CoercedToContinueWork" text,
	"LaborExploitPastThreeMonths" text,
	"CounselingReceived" integer,
	"IndividualCounseling" integer,
	"FamilyCounseling" integer,
	"GroupCounseling" integer,
	"SessionCountAtExit" integer,
	"PostExitCounselingPlan" integer,
	"SessionsInPlan" integer,
	"DestinationSafeClient" integer,
	"DestinationSafeWorker" integer,
	"PosAdultConnections" integer,
	"PosPeerConnections" integer,
	"PosCommunityConnections" integer,
	"AftercareDate" timestamp,
	"AftercareProvided" text,
	"EmailSocialMedia" text,
	"Telephone" text,
	"InPersonIndividual" text,
	"InPersonGroup" text,
	"CMExitReason" text,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Export" (
	"ExportID" integer PRIMARY KEY NOT NULL,
	"SourceType" integer,
	"SourceID" text,
	"SourceName" text,
	"SourceContactFirst" text,
	"SourceContactLast" text,
	"SourceContactPhone" text,
	"SourceContactExtension" text,
	"SourceContactEmail" text,
	"ExportDate" timestamp,
	"ExportStartDate" timestamp,
	"ExportEndDate" timestamp,
	"SoftwareName" text,
	"SoftwareVersion" numeric,
	"CSVVersion" text,
	"ExportPeriodType" integer,
	"ExportDirective" integer,
	"HashStatus" integer,
	"ImplementationID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Funder" (
	"FunderID" integer PRIMARY KEY NOT NULL,
	"ProjectID" integer,
	"Funder" integer,
	"OtherFunder" text,
	"GrantID" text,
	"StartDate" timestamp,
	"EndDate" timestamp,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "HealthAndDV" (
	"HealthAndDVID" text PRIMARY KEY NOT NULL,
	"EnrollmentID" integer,
	"PersonalID" integer,
	"InformationDate" timestamp,
	"DomesticViolenceSurvivor" integer,
	"WhenOccurred" integer,
	"CurrentlyFleeing" integer,
	"GeneralHealthStatus" integer,
	"DentalHealthStatus" integer,
	"MentalHealthStatus" integer,
	"PregnancyStatus" integer,
	"DueDate" timestamp,
	"DataCollectionStage" integer,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "HMISParticipation" (
	"HMISParticipationID" integer PRIMARY KEY NOT NULL,
	"ProjectID" integer,
	"HMISParticipationType" integer,
	"HMISParticipationStatusStartDate" timestamp,
	"HMISParticipationStatusEndDate" timestamp,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "IncomeBenefits" (
	"IncomeBenefitsID" text PRIMARY KEY NOT NULL,
	"EnrollmentID" integer,
	"PersonalID" integer,
	"InformationDate" timestamp,
	"IncomeFromAnySource" integer,
	"TotalMonthlyIncome" numeric,
	"Earned" integer,
	"EarnedAmount" numeric,
	"Unemployment" integer,
	"UnemploymentAmount" numeric,
	"SSI" integer,
	"SSIAmount" numeric,
	"SSDI" integer,
	"SSDIAmount" integer,
	"VADisabilityService" integer,
	"VADisabilityServiceAmount" numeric,
	"VADisabilityNonService" integer,
	"VADisabilityNonServiceAmount" numeric,
	"PrivateDisability" integer,
	"PrivateDisabilityAmount" numeric,
	"WorkersComp" integer,
	"WorkersCompAmount" integer,
	"TANF" integer,
	"TANFAmount" numeric,
	"GA" integer,
	"GAAmount" integer,
	"SocSecRetirement" integer,
	"SocSecRetirementAmount" numeric,
	"Pension" integer,
	"PensionAmount" numeric,
	"ChildSupport" integer,
	"ChildSupportAmount" numeric,
	"Alimony" integer,
	"AlimonyAmount" integer,
	"OtherIncomeSource" integer,
	"OtherIncomeAmount" integer,
	"OtherIncomeSourceIdentify" text,
	"BenefitsFromAnySource" integer,
	"SNAP" integer,
	"WIC" integer,
	"TANFChildCare" integer,
	"TANFTransportation" integer,
	"OtherTANF" integer,
	"OtherBenefitsSource" integer,
	"OtherBenefitsSourceIdentify" text,
	"InsuranceFromAnySource" integer,
	"Medicaid" integer,
	"NoMedicaidReason" integer,
	"Medicare" integer,
	"NoMedicareReason" integer,
	"SCHIP" integer,
	"NoSCHIPReason" integer,
	"VHAServices" integer,
	"NoVHAReason" integer,
	"EmployerProvided" integer,
	"NoEmployerProvidedReason" integer,
	"COBRA" integer,
	"NoCOBRAReason" integer,
	"PrivatePay" integer,
	"NoPrivatePayReason" integer,
	"StateHealthIns" integer,
	"NoStateHealthInsReason" integer,
	"IndianHealthServices" integer,
	"NoIndianHealthServicesReason" integer,
	"OtherInsurance" integer,
	"OtherInsuranceIdentify" text,
	"ConnectionWithSOAR" integer,
	"DataCollectionStage" integer,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Inventory" (
	"InventoryID" integer PRIMARY KEY NOT NULL,
	"ProjectID" integer,
	"CoCCode" text,
	"HouseholdType" integer,
	"Availability" integer,
	"UnitInventory" integer,
	"BedInventory" integer,
	"CHVetBedInventory" integer,
	"YouthVetBedInventory" integer,
	"VetBedInventory" integer,
	"CHYouthBedInventory" integer,
	"YouthBedInventory" integer,
	"CHBedInventory" integer,
	"OtherBedInventory" integer,
	"ESBedType" integer,
	"InventoryStartDate" timestamp,
	"InventoryEndDate" timestamp,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Organization" (
	"OrganizationID" integer PRIMARY KEY NOT NULL,
	"OrganizationName" text,
	"VictimServiceProvider" integer,
	"OrganizationCommonName" text,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Project" (
	"ProjectID" integer PRIMARY KEY NOT NULL,
	"OrganizationID" integer,
	"ProjectName" text,
	"ProjectCommonName" text,
	"OperatingStartDate" timestamp,
	"OperatingEndDate" timestamp,
	"ContinuumProject" integer,
	"ProjectType" integer,
	"HousingType" integer,
	"RRHSubType" integer,
	"ResidentialAffiliation" integer,
	"TargetPopulation" integer,
	"HOPWAMedAssistedLivingFac" integer,
	"PITCount" text,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProjectCoC" (
	"ProjectCoCID" integer PRIMARY KEY NOT NULL,
	"ProjectID" integer,
	"CoCCode" text,
	"Geocode" integer,
	"Address1" text,
	"Address2" text,
	"City" text,
	"State" text,
	"ZIP" integer,
	"GeographyType" integer,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Services" (
	"ServicesID" integer PRIMARY KEY NOT NULL,
	"EnrollmentID" integer,
	"PersonalID" integer,
	"DateProvided" timestamp,
	"RecordType" integer,
	"TypeProvided" integer,
	"OtherTypeProvided" text,
	"SubTypeProvided" integer,
	"FAAmount" numeric,
	"ReferralOutcome" text,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"UserID" integer,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "HMIS_User" (
	"UserID" integer PRIMARY KEY NOT NULL,
	"UserFirstName" text,
	"UserLastName" text,
	"UserPhone" integer,
	"UserExtension" text,
	"UserEmail" text,
	"DateCreated" timestamp,
	"DateUpdated" timestamp,
	"DateDeleted" timestamp,
	"ExportID" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_EnrollmentID_Enrollment_EnrollmentID_fk" FOREIGN KEY ("EnrollmentID") REFERENCES "public"."Enrollment"("EnrollmentID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_PersonalID_Client_PersonalID_fk" FOREIGN KEY ("PersonalID") REFERENCES "public"."Client"("PersonalID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CurrentLivingSituation" ADD CONSTRAINT "CurrentLivingSituation_EnrollmentID_Enrollment_EnrollmentID_fk" FOREIGN KEY ("EnrollmentID") REFERENCES "public"."Enrollment"("EnrollmentID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CurrentLivingSituation" ADD CONSTRAINT "CurrentLivingSituation_PersonalID_Client_PersonalID_fk" FOREIGN KEY ("PersonalID") REFERENCES "public"."Client"("PersonalID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EmploymentEducation" ADD CONSTRAINT "EmploymentEducation_EnrollmentID_Enrollment_EnrollmentID_fk" FOREIGN KEY ("EnrollmentID") REFERENCES "public"."Enrollment"("EnrollmentID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EmploymentEducation" ADD CONSTRAINT "EmploymentEducation_PersonalID_Client_PersonalID_fk" FOREIGN KEY ("PersonalID") REFERENCES "public"."Client"("PersonalID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_PersonalID_Client_PersonalID_fk" FOREIGN KEY ("PersonalID") REFERENCES "public"."Client"("PersonalID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_ProjectID_Project_ProjectID_fk" FOREIGN KEY ("ProjectID") REFERENCES "public"."Project"("ProjectID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Event" ADD CONSTRAINT "Event_EnrollmentID_Enrollment_EnrollmentID_fk" FOREIGN KEY ("EnrollmentID") REFERENCES "public"."Enrollment"("EnrollmentID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Event" ADD CONSTRAINT "Event_PersonalID_Client_PersonalID_fk" FOREIGN KEY ("PersonalID") REFERENCES "public"."Client"("PersonalID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Exit" ADD CONSTRAINT "Exit_EnrollmentID_Enrollment_EnrollmentID_fk" FOREIGN KEY ("EnrollmentID") REFERENCES "public"."Enrollment"("EnrollmentID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Exit" ADD CONSTRAINT "Exit_PersonalID_Client_PersonalID_fk" FOREIGN KEY ("PersonalID") REFERENCES "public"."Client"("PersonalID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Funder" ADD CONSTRAINT "Funder_ProjectID_Project_ProjectID_fk" FOREIGN KEY ("ProjectID") REFERENCES "public"."Project"("ProjectID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HealthAndDV" ADD CONSTRAINT "HealthAndDV_EnrollmentID_Enrollment_EnrollmentID_fk" FOREIGN KEY ("EnrollmentID") REFERENCES "public"."Enrollment"("EnrollmentID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HealthAndDV" ADD CONSTRAINT "HealthAndDV_PersonalID_Client_PersonalID_fk" FOREIGN KEY ("PersonalID") REFERENCES "public"."Client"("PersonalID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HMISParticipation" ADD CONSTRAINT "HMISParticipation_ProjectID_Project_ProjectID_fk" FOREIGN KEY ("ProjectID") REFERENCES "public"."Project"("ProjectID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "IncomeBenefits" ADD CONSTRAINT "IncomeBenefits_EnrollmentID_Enrollment_EnrollmentID_fk" FOREIGN KEY ("EnrollmentID") REFERENCES "public"."Enrollment"("EnrollmentID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "IncomeBenefits" ADD CONSTRAINT "IncomeBenefits_PersonalID_Client_PersonalID_fk" FOREIGN KEY ("PersonalID") REFERENCES "public"."Client"("PersonalID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_ProjectID_Project_ProjectID_fk" FOREIGN KEY ("ProjectID") REFERENCES "public"."Project"("ProjectID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Project" ADD CONSTRAINT "Project_OrganizationID_Organization_OrganizationID_fk" FOREIGN KEY ("OrganizationID") REFERENCES "public"."Organization"("OrganizationID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProjectCoC" ADD CONSTRAINT "ProjectCoC_ProjectID_Project_ProjectID_fk" FOREIGN KEY ("ProjectID") REFERENCES "public"."Project"("ProjectID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Services" ADD CONSTRAINT "Services_EnrollmentID_Enrollment_EnrollmentID_fk" FOREIGN KEY ("EnrollmentID") REFERENCES "public"."Enrollment"("EnrollmentID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Services" ADD CONSTRAINT "Services_PersonalID_Client_PersonalID_fk" FOREIGN KEY ("PersonalID") REFERENCES "public"."Client"("PersonalID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "assessment_enrollment_id_idx" ON "Assessment" USING btree ("EnrollmentID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "assessment_personal_id_idx" ON "Assessment" USING btree ("PersonalID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "assessment_export_id_idx" ON "Assessment" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "assessment_date_idx" ON "Assessment" USING btree ("AssessmentDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_export_id_idx" ON "Client" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "current_living_situation_enrollment_id_idx" ON "CurrentLivingSituation" USING btree ("EnrollmentID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "current_living_situation_personal_id_idx" ON "CurrentLivingSituation" USING btree ("PersonalID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "current_living_situation_export_id_idx" ON "CurrentLivingSituation" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "current_living_situation_information_date_idx" ON "CurrentLivingSituation" USING btree ("InformationDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employment_education_enrollment_id_idx" ON "EmploymentEducation" USING btree ("EnrollmentID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employment_education_personal_id_idx" ON "EmploymentEducation" USING btree ("PersonalID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employment_education_export_id_idx" ON "EmploymentEducation" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employment_education_information_date_idx" ON "EmploymentEducation" USING btree ("InformationDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "enrollment_personal_id_idx" ON "Enrollment" USING btree ("PersonalID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "enrollment_project_id_idx" ON "Enrollment" USING btree ("ProjectID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "enrollment_export_id_idx" ON "Enrollment" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "enrollment_entry_date_idx" ON "Enrollment" USING btree ("EntryDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_enrollment_id_idx" ON "Event" USING btree ("EnrollmentID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_personal_id_idx" ON "Event" USING btree ("PersonalID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_export_id_idx" ON "Event" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_date_idx" ON "Event" USING btree ("EventDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exit_enrollment_id_idx" ON "Exit" USING btree ("EnrollmentID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exit_personal_id_idx" ON "Exit" USING btree ("PersonalID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exit_export_id_idx" ON "Exit" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exit_date_idx" ON "Exit" USING btree ("ExitDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "funder_project_id_idx" ON "Funder" USING btree ("ProjectID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "funder_export_id_idx" ON "Funder" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "funder_start_date_idx" ON "Funder" USING btree ("StartDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "funder_end_date_idx" ON "Funder" USING btree ("EndDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "health_and_dv_enrollment_id_idx" ON "HealthAndDV" USING btree ("EnrollmentID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "health_and_dv_personal_id_idx" ON "HealthAndDV" USING btree ("PersonalID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "health_and_dv_export_id_idx" ON "HealthAndDV" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "health_and_dv_information_date_idx" ON "HealthAndDV" USING btree ("InformationDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hmis_participation_project_id_idx" ON "HMISParticipation" USING btree ("ProjectID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hmis_participation_export_id_idx" ON "HMISParticipation" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hmis_participation_start_date_idx" ON "HMISParticipation" USING btree ("HMISParticipationStatusStartDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hmis_participation_end_date_idx" ON "HMISParticipation" USING btree ("HMISParticipationStatusEndDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "income_benefits_enrollment_id_idx" ON "IncomeBenefits" USING btree ("EnrollmentID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "income_benefits_personal_id_idx" ON "IncomeBenefits" USING btree ("PersonalID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "income_benefits_export_id_idx" ON "IncomeBenefits" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "income_benefits_information_date_idx" ON "IncomeBenefits" USING btree ("InformationDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inventory_project_id_idx" ON "Inventory" USING btree ("ProjectID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inventory_export_id_idx" ON "Inventory" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inventory_start_date_idx" ON "Inventory" USING btree ("InventoryStartDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inventory_end_date_idx" ON "Inventory" USING btree ("InventoryEndDate");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_export_id_idx" ON "Organization" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_organization_id_idx" ON "Project" USING btree ("OrganizationID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_export_id_idx" ON "Project" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_coc_project_id_idx" ON "ProjectCoC" USING btree ("ProjectID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_coc_export_id_idx" ON "ProjectCoC" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_enrollment_id_idx" ON "Services" USING btree ("EnrollmentID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_personal_id_idx" ON "Services" USING btree ("PersonalID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_export_id_idx" ON "Services" USING btree ("ExportID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_date_provided_idx" ON "Services" USING btree ("DateProvided");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_export_id_idx" ON "HMIS_User" USING btree ("ExportID");