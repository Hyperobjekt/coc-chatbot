import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  json,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { AppUsage } from "../usage";

// Keep the existing chat app tables as they are
export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
  lastContext: jsonb("lastContext").$type<AppUsage | null>(),
});

export type Chat = InferSelectModel<typeof chat>;

export const messageDeprecated = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

export const message = pgTable("Message_v2", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

export const voteDeprecated = pgTable(
  "Vote",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => messageDeprecated.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>;

export const vote = pgTable(
  "Vote_v2",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: ["text", "code", "image", "sheet"] })
      .notNull()
      .default("text"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  }
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  "Suggestion",
  {
    id: uuid("id").notNull().defaultRandom(),
    documentId: uuid("documentId").notNull(),
    documentCreatedAt: timestamp("documentCreatedAt").notNull(),
    originalText: text("originalText").notNull(),
    suggestedText: text("suggestedText").notNull(),
    description: text("description"),
    isResolved: boolean("isResolved").notNull().default(false),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
  "Stream",
  {
    id: uuid("id").notNull().defaultRandom(),
    chatId: uuid("chatId").notNull(),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatRef: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
    }),
  })
);

export type Stream = InferSelectModel<typeof stream>;

// HMIS Tables - All date fields as text

export const organization = pgTable("Organization", {
  OrganizationID: integer("OrganizationID").primaryKey(),
  OrganizationName: text("OrganizationName"),
  VictimServiceProvider: integer("VictimServiceProvider"),
  OrganizationCommonName: text("OrganizationCommonName"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  exportIdIdx: index("organization_export_id_idx").on(table.ExportID),
}));

export const project = pgTable("Project", {
  ProjectID: integer("ProjectID").primaryKey(),
  OrganizationID: integer("OrganizationID").references(() => organization.OrganizationID),
  ProjectName: text("ProjectName"),
  ProjectCommonName: text("ProjectCommonName"),
  OperatingStartDate: text("OperatingStartDate"),
  OperatingEndDate: text("OperatingEndDate"),
  ContinuumProject: integer("ContinuumProject"),
  ProjectType: integer("ProjectType").references(() => projectTypeLookup.Code),
  HousingType: integer("HousingType"),
  RRHSubType: integer("RRHSubType"),
  ResidentialAffiliation: integer("ResidentialAffiliation"),
  TargetPopulation: integer("TargetPopulation"),
  HOPWAMedAssistedLivingFac: integer("HOPWAMedAssistedLivingFac"),
  PITCount: text("PITCount"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  orgIdIdx: index("project_organization_id_idx").on(table.OrganizationID),
  exportIdIdx: index("project_export_id_idx").on(table.ExportID),
}));

export const client = pgTable("Client", {
  PersonalID: integer("PersonalID").primaryKey(),
  FirstName: text("FirstName"),
  MiddleName: text("MiddleName"),
  LastName: text("LastName"),
  NameSuffix: text("NameSuffix"),
  NameDataQuality: integer("NameDataQuality"),
  SSN: text("SSN"),
  SSNDataQuality: integer("SSNDataQuality"),
  DOB: text("DOB"),
  DOBDataQuality: integer("DOBDataQuality"),
  AmIndAKNative: integer("AmIndAKNative"),
  Asian: integer("Asian"),
  BlackAfAmerican: integer("BlackAfAmerican"),
  HispanicLatinaeo: integer("HispanicLatinaeo"),
  MidEastNAfrican: integer("MidEastNAfrican"),
  NativeHIPacific: integer("NativeHIPacific"),
  White: integer("White"),
  RaceNone: integer("RaceNone"),
  AdditionalRaceEthnicity: text("AdditionalRaceEthnicity"),
  Woman: integer("Woman"),
  Man: integer("Man"),
  NonBinary: integer("NonBinary"),
  CulturallySpecific: integer("CulturallySpecific"),
  Transgender: integer("Transgender"),
  Questioning: integer("Questioning"),
  DifferentIdentity: integer("DifferentIdentity"),
  GenderNone: integer("GenderNone"),
  DifferentIdentityText: text("DifferentIdentityText"),
  VeteranStatus: integer("VeteranStatus"),
  YearEnteredService: integer("YearEnteredService"),
  YearSeparated: integer("YearSeparated"),
  WorldWarII: integer("WorldWarII"),
  KoreanWar: integer("KoreanWar"),
  VietnamWar: integer("VietnamWar"),
  DesertStorm: integer("DesertStorm"),
  AfghanistanOEF: integer("AfghanistanOEF"),
  IraqOIF: integer("IraqOIF"),
  IraqOND: integer("IraqOND"),
  OtherTheater: integer("OtherTheater"),
  MilitaryBranch: integer("MilitaryBranch"),
  DischargeStatus: integer("DischargeStatus"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  exportIdIdx: index("client_export_id_idx").on(table.ExportID),
}));

export const enrollment = pgTable("Enrollment", {
  EnrollmentID: integer("EnrollmentID").primaryKey(),
  PersonalID: integer("PersonalID").references(() => client.PersonalID),
  ProjectID: integer("ProjectID").references(() => project.ProjectID),
  EntryDate: text("EntryDate"),
  HouseholdID: text("HouseholdID"),
  RelationshipToHoH: integer("RelationshipToHoH"),
  EnrollmentCoC: text("EnrollmentCoC"),
  LivingSituation: integer("LivingSituation").references(() => livingSituationLookup.Code),
  RentalSubsidyType: integer("RentalSubsidyType"),
  LengthOfStay: integer("LengthOfStay"),
  LOSUnderThreshold: integer("LOSUnderThreshold"),
  PreviousStreetESSH: integer("PreviousStreetESSH"),
  DateToStreetESSH: text("DateToStreetESSH"),
  TimesHomelessPastThreeYears: integer("TimesHomelessPastThreeYears"),
  MonthsHomelessPastThreeYears: integer("MonthsHomelessPastThreeYears"),
  DisablingCondition: integer("DisablingCondition"),
  DateOfEngagement: text("DateOfEngagement"),
  MoveInDate: text("MoveInDate"),
  DateOfPATHStatus: text("DateOfPATHStatus"),
  ClientEnrolledInPATH: integer("ClientEnrolledInPATH"),
  ReasonNotEnrolled: integer("ReasonNotEnrolled"),
  PercentAMI: integer("PercentAMI"),
  ReferralSource: integer("ReferralSource"),
  CountOutreachReferralApproaches: integer("CountOutreachReferralApproaches"),
  DateOfBCPStatus: text("DateOfBCPStatus"),
  EligibleForRHY: integer("EligibleForRHY"),
  ReasonNoServices: integer("ReasonNoServices"),
  RunawayYouth: integer("RunawayYouth"),
  SexualOrientation: integer("SexualOrientation"),
  SexualOrientationOther: text("SexualOrientationOther"),
  FormerWardChildWelfare: integer("FormerWardChildWelfare"),
  ChildWelfareYears: integer("ChildWelfareYears"),
  ChildWelfareMonths: integer("ChildWelfareMonths"),
  FormerWardJuvenileJustice: integer("FormerWardJuvenileJustice"),
  JuvenileJusticeYears: integer("JuvenileJusticeYears"),
  JuvenileJusticeMonths: integer("JuvenileJusticeMonths"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  personalIdIdx: index("enrollment_personal_id_idx").on(table.PersonalID),
  projectIdIdx: index("enrollment_project_id_idx").on(table.ProjectID),
  exportIdIdx: index("enrollment_export_id_idx").on(table.ExportID),
  entryDateIdx: index("enrollment_entry_date_idx").on(table.EntryDate),
}));

export const exit = pgTable("Exit", {
  ExitID: integer("ExitID").primaryKey(),
  EnrollmentID: integer("EnrollmentID").references(() => enrollment.EnrollmentID),
  PersonalID: integer("PersonalID").references(() => client.PersonalID),
  ExitDate: text("ExitDate"),
  Destination: integer("Destination").references(() => destinationLookup.Code),
  DestinationSubsidyType: integer("DestinationSubsidyType"),
  OtherDestination: text("OtherDestination"),
  HousingAssessment: integer("HousingAssessment"),
  SubsidyInformation: integer("SubsidyInformation"),
  ProjectCompletionStatus: integer("ProjectCompletionStatus"),
  EarlyExitReason: integer("EarlyExitReason"),
  ExchangeForSex: integer("ExchangeForSex"),
  ExchangeForSexPastThreeMonths: integer("ExchangeForSexPastThreeMonths"),
  CountOfExchangeForSex: integer("CountOfExchangeForSex"),
  AskedOrForcedToExchangeForSex: integer("AskedOrForcedToExchangeForSex"),
  WorkplaceViolenceThreats: integer("WorkplaceViolenceThreats"),
  WorkplacePromiseDifference: integer("WorkplacePromiseDifference"),
  CoercedToContinueWork: text("CoercedToContinueWork"),
  LaborExploitPastThreeMonths: text("LaborExploitPastThreeMonths"),
  CounselingReceived: integer("CounselingReceived"),
  IndividualCounseling: integer("IndividualCounseling"),
  FamilyCounseling: integer("FamilyCounseling"),
  GroupCounseling: integer("GroupCounseling"),
  SessionCountAtExit: integer("SessionCountAtExit"),
  PostExitCounselingPlan: integer("PostExitCounselingPlan"),
  SessionsInPlan: integer("SessionsInPlan"),
  DestinationSafeClient: integer("DestinationSafeClient"),
  DestinationSafeWorker: integer("DestinationSafeWorker"),
  PosAdultConnections: integer("PosAdultConnections"),
  PosPeerConnections: integer("PosPeerConnections"),
  PosCommunityConnections: integer("PosCommunityConnections"),
  AftercareDate: text("AftercareDate"),
  AftercareProvided: text("AftercareProvided"),
  EmailSocialMedia: text("EmailSocialMedia"),
  Telephone: text("Telephone"),
  InPersonIndividual: text("InPersonIndividual"),
  InPersonGroup: text("InPersonGroup"),
  CMExitReason: text("CMExitReason"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  enrollmentIdIdx: index("exit_enrollment_id_idx").on(table.EnrollmentID),
  personalIdIdx: index("exit_personal_id_idx").on(table.PersonalID),
  exportIdIdx: index("exit_export_id_idx").on(table.ExportID),
  exitDateIdx: index("exit_date_idx").on(table.ExitDate),
}));

export const services = pgTable("Services", {
  ServicesID: integer("ServicesID").primaryKey(),
  EnrollmentID: integer("EnrollmentID").references(() => enrollment.EnrollmentID),
  PersonalID: integer("PersonalID").references(() => client.PersonalID),
  DateProvided: text("DateProvided"),
  RecordType: integer("RecordType"),
  TypeProvided: integer("TypeProvided"),
  OtherTypeProvided: text("OtherTypeProvided"),
  SubTypeProvided: integer("SubTypeProvided"),
  FAAmount: numeric("FAAmount"),
  ReferralOutcome: text("ReferralOutcome"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  enrollmentIdIdx: index("services_enrollment_id_idx").on(table.EnrollmentID),
  personalIdIdx: index("services_personal_id_idx").on(table.PersonalID),
  exportIdIdx: index("services_export_id_idx").on(table.ExportID),
  dateProvidedIdx: index("services_date_provided_idx").on(table.DateProvided),
}));

export const assessment = pgTable("Assessment", {
  AssessmentID: integer("AssessmentID").primaryKey(),
  EnrollmentID: integer("EnrollmentID").references(() => enrollment.EnrollmentID),
  PersonalID: integer("PersonalID").references(() => client.PersonalID),
  AssessmentDate: text("AssessmentDate"),
  AssessmentLocation: integer("AssessmentLocation"),
  AssessmentType: integer("AssessmentType"),
  AssessmentLevel: integer("AssessmentLevel"),
  PrioritizationStatus: integer("PrioritizationStatus"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  enrollmentIdIdx: index("assessment_enrollment_id_idx").on(table.EnrollmentID),
  personalIdIdx: index("assessment_personal_id_idx").on(table.PersonalID),
  exportIdIdx: index("assessment_export_id_idx").on(table.ExportID),
  assessmentDateIdx: index("assessment_date_idx").on(table.AssessmentDate),
}));

export const healthAndDV = pgTable("HealthAndDV", {
  HealthAndDVID: text("HealthAndDVID").primaryKey(),
  EnrollmentID: integer("EnrollmentID").references(() => enrollment.EnrollmentID),
  PersonalID: integer("PersonalID").references(() => client.PersonalID),
  InformationDate: text("InformationDate"),
  DomesticViolenceSurvivor: integer("DomesticViolenceSurvivor"),
  WhenOccurred: integer("WhenOccurred"),
  CurrentlyFleeing: integer("CurrentlyFleeing"),
  GeneralHealthStatus: integer("GeneralHealthStatus"),
  DentalHealthStatus: integer("DentalHealthStatus"),
  MentalHealthStatus: integer("MentalHealthStatus"),
  PregnancyStatus: integer("PregnancyStatus"),
  DueDate: text("DueDate"),
  DataCollectionStage: integer("DataCollectionStage"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  enrollmentIdIdx: index("health_and_dv_enrollment_id_idx").on(table.EnrollmentID),
  personalIdIdx: index("health_and_dv_personal_id_idx").on(table.PersonalID),
  exportIdIdx: index("health_and_dv_export_id_idx").on(table.ExportID),
  informationDateIdx: index("health_and_dv_information_date_idx").on(table.InformationDate),
}));

export const incomeBenefits = pgTable("IncomeBenefits", {
  IncomeBenefitsID: text("IncomeBenefitsID").primaryKey(),
  EnrollmentID: integer("EnrollmentID").references(() => enrollment.EnrollmentID),
  PersonalID: integer("PersonalID").references(() => client.PersonalID),
  InformationDate: text("InformationDate"),
  IncomeFromAnySource: integer("IncomeFromAnySource"),
  TotalMonthlyIncome: numeric("TotalMonthlyIncome"),
  Earned: integer("Earned"),
  EarnedAmount: numeric("EarnedAmount"),
  Unemployment: integer("Unemployment"),
  UnemploymentAmount: numeric("UnemploymentAmount"),
  SSI: integer("SSI"),
  SSIAmount: numeric("SSIAmount"),
  SSDI: integer("SSDI"),
  SSDIAmount: integer("SSDIAmount"),
  VADisabilityService: integer("VADisabilityService"),
  VADisabilityServiceAmount: numeric("VADisabilityServiceAmount"),
  VADisabilityNonService: integer("VADisabilityNonService"),
  VADisabilityNonServiceAmount: numeric("VADisabilityNonServiceAmount"),
  PrivateDisability: integer("PrivateDisability"),
  PrivateDisabilityAmount: numeric("PrivateDisabilityAmount"),
  WorkersComp: integer("WorkersComp"),
  WorkersCompAmount: integer("WorkersCompAmount"),
  TANF: integer("TANF"),
  TANFAmount: numeric("TANFAmount"),
  GA: integer("GA"),
  GAAmount: integer("GAAmount"),
  SocSecRetirement: integer("SocSecRetirement"),
  SocSecRetirementAmount: numeric("SocSecRetirementAmount"),
  Pension: integer("Pension"),
  PensionAmount: numeric("PensionAmount"),
  ChildSupport: integer("ChildSupport"),
  ChildSupportAmount: numeric("ChildSupportAmount"),
  Alimony: integer("Alimony"),
  AlimonyAmount: integer("AlimonyAmount"),
  OtherIncomeSource: integer("OtherIncomeSource"),
  OtherIncomeAmount: integer("OtherIncomeAmount"),
  OtherIncomeSourceIdentify: text("OtherIncomeSourceIdentify"),
  BenefitsFromAnySource: integer("BenefitsFromAnySource"),
  SNAP: integer("SNAP"),
  WIC: integer("WIC"),
  TANFChildCare: integer("TANFChildCare"),
  TANFTransportation: integer("TANFTransportation"),
  OtherTANF: integer("OtherTANF"),
  OtherBenefitsSource: integer("OtherBenefitsSource"),
  OtherBenefitsSourceIdentify: text("OtherBenefitsSourceIdentify"),
  InsuranceFromAnySource: integer("InsuranceFromAnySource"),
  Medicaid: integer("Medicaid"),
  NoMedicaidReason: integer("NoMedicaidReason"),
  Medicare: integer("Medicare"),
  NoMedicareReason: integer("NoMedicareReason"),
  SCHIP: integer("SCHIP"),
  NoSCHIPReason: integer("NoSCHIPReason"),
  VHAServices: integer("VHAServices"),
  NoVHAReason: integer("NoVHAReason"),
  EmployerProvided: integer("EmployerProvided"),
  NoEmployerProvidedReason: integer("NoEmployerProvidedReason"),
  COBRA: integer("COBRA"),
  NoCOBRAReason: integer("NoCOBRAReason"),
  PrivatePay: integer("PrivatePay"),
  NoPrivatePayReason: integer("NoPrivatePayReason"),
  StateHealthIns: integer("StateHealthIns"),
  NoStateHealthInsReason: integer("NoStateHealthInsReason"),
  IndianHealthServices: integer("IndianHealthServices"),
  NoIndianHealthServicesReason: integer("NoIndianHealthServicesReason"),
  OtherInsurance: integer("OtherInsurance"),
  OtherInsuranceIdentify: text("OtherInsuranceIdentify"),
  ConnectionWithSOAR: integer("ConnectionWithSOAR"),
  DataCollectionStage: integer("DataCollectionStage"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  enrollmentIdIdx: index("income_benefits_enrollment_id_idx").on(table.EnrollmentID),
  personalIdIdx: index("income_benefits_personal_id_idx").on(table.PersonalID),
  exportIdIdx: index("income_benefits_export_id_idx").on(table.ExportID),
  informationDateIdx: index("income_benefits_information_date_idx").on(table.InformationDate),
}));

export const employmentEducation = pgTable("EmploymentEducation", {
  EmploymentEducationID: text("EmploymentEducationID").primaryKey(),
  EnrollmentID: integer("EnrollmentID").references(() => enrollment.EnrollmentID),
  PersonalID: integer("PersonalID").references(() => client.PersonalID),
  InformationDate: text("InformationDate"),
  LastGradeCompleted: integer("LastGradeCompleted"),
  SchoolStatus: integer("SchoolStatus"),
  Employed: integer("Employed"),
  EmploymentType: integer("EmploymentType"),
  NotEmployedReason: integer("NotEmployedReason"),
  DataCollectionStage: integer("DataCollectionStage"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  enrollmentIdIdx: index("employment_education_enrollment_id_idx").on(table.EnrollmentID),
  personalIdIdx: index("employment_education_personal_id_idx").on(table.PersonalID),
  exportIdIdx: index("employment_education_export_id_idx").on(table.ExportID),
  informationDateIdx: index("employment_education_information_date_idx").on(table.InformationDate),
}));

export const currentLivingSituation = pgTable("CurrentLivingSituation", {
  CurrentLivingSitID: integer("CurrentLivingSitID").primaryKey(),
  EnrollmentID: integer("EnrollmentID").references(() => enrollment.EnrollmentID),
  PersonalID: integer("PersonalID").references(() => client.PersonalID),
  InformationDate: text("InformationDate"),
  CurrentLivingSituation: integer("CurrentLivingSituation"),
  CLSSubsidyType: text("CLSSubsidyType"),
  VerifiedBy: text("VerifiedBy"),
  LeaveSituation14Days: integer("LeaveSituation14Days"),
  SubsequentResidence: integer("SubsequentResidence"),
  ResourcesToObtain: integer("ResourcesToObtain"),
  LeaseOwn60Day: integer("LeaseOwn60Day"),
  MovedTwoOrMore: integer("MovedTwoOrMore"),
  LocationDetails: text("LocationDetails"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  enrollmentIdIdx: index("current_living_situation_enrollment_id_idx").on(table.EnrollmentID),
  personalIdIdx: index("current_living_situation_personal_id_idx").on(table.PersonalID),
  exportIdIdx: index("current_living_situation_export_id_idx").on(table.ExportID),
  informationDateIdx: index("current_living_situation_information_date_idx").on(table.InformationDate),
}));

export const event = pgTable("Event", {
  EventID: integer("EventID").primaryKey(),
  EnrollmentID: integer("EnrollmentID").references(() => enrollment.EnrollmentID),
  PersonalID: integer("PersonalID").references(() => client.PersonalID),
  EventDate: text("EventDate"),
  Event: integer("Event"),
  ProbSolDivRRResult: integer("ProbSolDivRRResult"),
  ReferralCaseManageAfter: integer("ReferralCaseManageAfter"),
  LocationCrisisOrPHHousing: text("LocationCrisisOrPHHousing"),
  ReferralResult: integer("ReferralResult"),
  ResultDate: text("ResultDate"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  enrollmentIdIdx: index("event_enrollment_id_idx").on(table.EnrollmentID),
  personalIdIdx: index("event_personal_id_idx").on(table.PersonalID),
  exportIdIdx: index("event_export_id_idx").on(table.ExportID),
  eventDateIdx: index("event_date_idx").on(table.EventDate),
}));

export const projectCoC = pgTable("ProjectCoC", {
  ProjectCoCID: integer("ProjectCoCID").primaryKey(),
  ProjectID: integer("ProjectID").references(() => project.ProjectID),
  CoCCode: text("CoCCode"),
  Geocode: integer("Geocode"),
  Address1: text("Address1"),
  Address2: text("Address2"),
  City: text("City"),
  State: text("State"),
  ZIP: integer("ZIP"),
  GeographyType: integer("GeographyType"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  projectIdIdx: index("project_coc_project_id_idx").on(table.ProjectID),
  exportIdIdx: index("project_coc_export_id_idx").on(table.ExportID),
}));

export const inventory = pgTable("Inventory", {
  InventoryID: integer("InventoryID").primaryKey(),
  ProjectID: integer("ProjectID").references(() => project.ProjectID),
  CoCCode: text("CoCCode"),
  HouseholdType: integer("HouseholdType"),
  Availability: integer("Availability"),
  UnitInventory: integer("UnitInventory"),
  BedInventory: integer("BedInventory"),
  CHVetBedInventory: integer("CHVetBedInventory"),
  YouthVetBedInventory: integer("YouthVetBedInventory"),
  VetBedInventory: integer("VetBedInventory"),
  CHYouthBedInventory: integer("CHYouthBedInventory"),
  YouthBedInventory: integer("YouthBedInventory"),
  CHBedInventory: integer("CHBedInventory"),
  OtherBedInventory: integer("OtherBedInventory"),
  ESBedType: integer("ESBedType"),
  InventoryStartDate: text("InventoryStartDate"),
  InventoryEndDate: text("InventoryEndDate"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  projectIdIdx: index("inventory_project_id_idx").on(table.ProjectID),
  exportIdIdx: index("inventory_export_id_idx").on(table.ExportID),
  startDateIdx: index("inventory_start_date_idx").on(table.InventoryStartDate),
  endDateIdx: index("inventory_end_date_idx").on(table.InventoryEndDate),
}));

export const export_ = pgTable("Export", {
  ExportID: integer("ExportID").primaryKey(),
  SourceType: integer("SourceType"),
  SourceID: text("SourceID"),
  SourceName: text("SourceName"),
  SourceContactFirst: text("SourceContactFirst"),
  SourceContactLast: text("SourceContactLast"),
  SourceContactPhone: text("SourceContactPhone"),
  SourceContactExtension: text("SourceContactExtension"),
  SourceContactEmail: text("SourceContactEmail"),
  ExportDate: text("ExportDate"),
  ExportStartDate: text("ExportStartDate"),
  ExportEndDate: text("ExportEndDate"),
  SoftwareName: text("SoftwareName"),
  SoftwareVersion: numeric("SoftwareVersion"),
  CSVVersion: text("CSVVersion"),
  ExportPeriodType: integer("ExportPeriodType"),
  ExportDirective: integer("ExportDirective"),
  HashStatus: integer("HashStatus"),
  ImplementationID: integer("ImplementationID"),
}, (table) => ({
  exportIdIdx: index("export_id_idx").on(table.ExportID),
}));

// Alias for CSV loading
export const Export = export_;

export const hmisParticipation = pgTable("HMISParticipation", {
  HMISParticipationID: integer("HMISParticipationID").primaryKey(),
  ProjectID: integer("ProjectID").references(() => project.ProjectID),
  HMISParticipationType: integer("HMISParticipationType"),
  HMISParticipationStatusStartDate: text("HMISParticipationStatusStartDate"),
  HMISParticipationStatusEndDate: text("HMISParticipationStatusEndDate"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  projectIdIdx: index("hmis_participation_project_id_idx").on(table.ProjectID),
  exportIdIdx: index("hmis_participation_export_id_idx").on(table.ExportID),
  startDateIdx: index("hmis_participation_start_date_idx").on(table.HMISParticipationStatusStartDate),
  endDateIdx: index("hmis_participation_end_date_idx").on(table.HMISParticipationStatusEndDate),
}));

export const ceParticipation = pgTable("CEParticipation", {
  CEParticipationID: integer("CEParticipationID").primaryKey(),
  ProjectID: integer("ProjectID").references(() => project.ProjectID),
  AccessPoint: integer("AccessPoint"),
  PreventionAssessment: integer("PreventionAssessment"),
  CrisisAssessment: integer("CrisisAssessment"),
  HousingAssessment: integer("HousingAssessment"),
  DirectServices: integer("DirectServices"),
  ReceivesReferrals: integer("ReceivesReferrals"),
  CEParticipationStatusStartDate: text("CEParticipationStatusStartDate"),
  CEParticipationStatusEndDate: text("CEParticipationStatusEndDate"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  projectIdIdx: index("ce_participation_project_id_idx").on(table.ProjectID),
  exportIdIdx: index("ce_participation_export_id_idx").on(table.ExportID),
  startDateIdx: index("ce_participation_start_date_idx").on(table.CEParticipationStatusStartDate),
  endDateIdx: index("ce_participation_end_date_idx").on(table.CEParticipationStatusEndDate),
}));

export const funder = pgTable("Funder", {
  FunderID: integer("FunderID").primaryKey(),
  ProjectID: integer("ProjectID").references(() => project.ProjectID),
  Funder: integer("Funder"),
  OtherFunder: text("OtherFunder"),
  GrantID: text("GrantID"),
  StartDate: text("StartDate"),
  EndDate: text("EndDate"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  projectIdIdx: index("funder_project_id_idx").on(table.ProjectID),
  exportIdIdx: index("funder_export_id_idx").on(table.ExportID),
  startDateIdx: index("funder_start_date_idx").on(table.StartDate),
  endDateIdx: index("funder_end_date_idx").on(table.EndDate),
}));

export const user_ = pgTable("HMIS_User", {
  UserID: integer("UserID").primaryKey(),
  UserFirstName: text("UserFirstName"),
  UserLastName: text("UserLastName"),
  UserPhone: text("UserPhone"),
  UserExtension: text("UserExtension"),
  UserEmail: text("UserEmail"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  exportIdIdx: index("user_export_id_idx").on(table.ExportID),
}));

export type ProjectCoC = InferSelectModel<typeof projectCoC>;
export type Inventory = InferSelectModel<typeof inventory>;
export type Export = InferSelectModel<typeof export_>;
export type HMISParticipation = InferSelectModel<typeof hmisParticipation>;
export type Funder = InferSelectModel<typeof funder>;
// Lookup Tables
export const livingSituationLookup = pgTable("LivingSituationLookup", {
  Code: integer("Code").primaryKey(),
  Category: text("Category").notNull(),
  Description: text("Description").notNull(),
});

export const projectTypeLookup = pgTable("ProjectTypeLookup", {
  Code: integer("Code").primaryKey(),
  Description: text("Description").notNull(),
});

export const destinationLookup = pgTable("DestinationLookup", {
  Code: integer("Code").primaryKey(),
  Category: text("Category").notNull(),
  Description: text("Description").notNull(),
});

export const housingStatusLookup = pgTable("HousingStatusLookup", {
  Code: integer("Code").primaryKey(),
  Description: text("Description").notNull(),
});

export type LivingSituationLookup = InferSelectModel<typeof livingSituationLookup>;
export type ProjectTypeLookup = InferSelectModel<typeof projectTypeLookup>;
export type DestinationLookup = InferSelectModel<typeof destinationLookup>;
export type HousingStatusLookup = InferSelectModel<typeof housingStatusLookup>;

export const youthEducationStatus = pgTable("YouthEducationStatus", {
  YouthEducationStatusID: text("YouthEducationStatusID").primaryKey(),
  EnrollmentID: integer("EnrollmentID").references(() => enrollment.EnrollmentID),
  PersonalID: integer("PersonalID").references(() => client.PersonalID),
  InformationDate: text("InformationDate"),
  CurrentSchoolAttend: integer("CurrentSchoolAttend"),
  MostRecentEdStatus: integer("MostRecentEdStatus"),
  CurrentEdStatus: integer("CurrentEdStatus"),
  DataCollectionStage: integer("DataCollectionStage"),
  DateCreated: text("DateCreated"),
  DateUpdated: text("DateUpdated"),
  UserID: integer("UserID"),
  DateDeleted: text("DateDeleted"),
  ExportID: integer("ExportID"),
}, (table) => ({
  enrollmentIdIdx: index("youth_education_status_enrollment_id_idx").on(table.EnrollmentID),
  personalIdIdx: index("youth_education_status_personal_id_idx").on(table.PersonalID),
  exportIdIdx: index("youth_education_status_export_id_idx").on(table.ExportID),
  informationDateIdx: index("youth_education_status_information_date_idx").on(table.InformationDate),
}));

export type HMISUser = InferSelectModel<typeof user_>;
export type CEParticipation = InferSelectModel<typeof ceParticipation>;
export type YouthEducationStatus = InferSelectModel<typeof youthEducationStatus>;
