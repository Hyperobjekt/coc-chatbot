# HMIS Database Schema Documentation

## Overview
This database implements the HUD HMIS Data Standards for tracking homeless services. It contains information about clients, their enrollments in projects, services received, and outcomes.

## Quick Reference
- 4,146 clients tracked across 27 projects
- All date fields stored as TEXT in ISO format (YYYY-MM-DD)
- All table/column names require double quotes in queries
- Row counts from current data:
  - 4,146 Clients
  - 4,771 Enrollments
  - 4,295 Exits
  - 4,472 Services
  - 9,623 Income/Benefits Records

## Core Tables

### Client (Demographics)
**Primary Key:** PersonalID (integer)
**Description:** Stores core demographic information about each client
**Key Fields:**
- PersonalID (integer, PK): Unique identifier
- FirstName, MiddleName, LastName (text): Client name components
- DOB (text): Date of birth in ISO format
- SSN (text): Social security number (last 4 digits only for CoC/ESG)
- VeteranStatus (integer): 0=No, 1=Yes
- AmIndAKNative, Asian, BlackAfAmerican, HispanicLatinaeo, MidEastNAfrican, NativeHIPacific, White (integer): Race indicators
- Woman, Man, NonBinary, CulturallySpecific, Transgender, Questioning, DifferentIdentity (integer): Gender indicators

### Enrollment (Project Participation)
**Primary Key:** EnrollmentID (integer)
**Foreign Keys:** 
- PersonalID → Client.PersonalID
- ProjectID → Project.ProjectID
**Description:** Records client enrollment in projects/programs
**Key Fields:**
- EnrollmentID (integer, PK): Unique enrollment identifier
- PersonalID (integer, FK): Links to Client
- ProjectID (integer, FK): Links to Project
- EntryDate (text): ISO date of project entry
- HouseholdID (text): Groups related enrollments
- RelationshipToHoH (integer): Relationship to head of household
- LivingSituation (integer): Prior living situation code
- DisablingCondition (integer): 0=No, 1=Yes
- MoveInDate (text): Housing move-in date for PH projects

### Exit (Outcomes)
**Primary Key:** ExitID (integer)
**Foreign Keys:**
- EnrollmentID → Enrollment.EnrollmentID
- PersonalID → Client.PersonalID
**Description:** Records project exit details and outcomes
**Key Fields:**
- ExitID (integer, PK): Unique exit identifier
- EnrollmentID (integer, FK): Links to Enrollment
- ExitDate (text): ISO date of project exit
- Destination (integer): Exit destination code
- HousingAssessment (integer): Housing outcome assessment

### Services (Service Delivery)
**Primary Key:** ServicesID (integer)
**Foreign Keys:**
- EnrollmentID → Enrollment.EnrollmentID
- PersonalID → Client.PersonalID
**Description:** Tracks services provided to clients
**Key Fields:**
- ServicesID (integer, PK): Unique service record ID
- EnrollmentID (integer, FK): Links to Enrollment
- DateProvided (text): ISO date service was provided
- TypeProvided (integer): Type of service code
- FAAmount (numeric): Financial assistance amount if applicable

### IncomeBenefits (Financial Status)
**Primary Key:** IncomeBenefitsID (text)
**Foreign Keys:**
- EnrollmentID → Enrollment.EnrollmentID
- PersonalID → Client.PersonalID
**Description:** Tracks client income sources and benefits
**Key Fields:**
- IncomeBenefitsID (text, PK): Unique identifier
- EnrollmentID (integer, FK): Links to Enrollment
- InformationDate (text): ISO date of collection
- IncomeFromAnySource (integer): 0=No, 1=Yes
- TotalMonthlyIncome (numeric): Total monthly income
- Various income indicators (integer): 0=No, 1=Yes
- Various income amounts (numeric): Monthly amounts

## Lookup Tables & Common Codes

### Project Types
- 0: Emergency Shelter - Entry Exit
- 1: Emergency Shelter - Night-by-Night
- 2: Transitional Housing
- 3: PH - Permanent Supportive Housing
- 4: Street Outreach
- 6: Services Only
- 8: Safe Haven
- 13: PH - Rapid Re-Housing
- 14: Coordinated Entry

### Living Situation/Destination Codes
**Homeless Situations (100-199):**
- 116: Place not meant for habitation
- 101: Emergency shelter/hotel/motel with voucher
- 118: Safe Haven

**Institutional Settings (200-299):**
- 201: Foster care
- 202: Hospital (non-psychiatric)
- 203: Jail/prison
- 204: Long-term care
- 205: Psychiatric facility
- 206: Substance abuse facility

**Temporary Housing (300-399):**
- 302: Transitional housing
- 303: Residential project (no homeless criteria)
- 304: Hotel/motel without voucher
- 305: Staying with family (temporary)
- 306: Staying with friends (temporary)

**Permanent Housing (400-499):**
- 401: Staying with family (permanent)
- 402: Staying with friends (permanent)
- 410: Rental without subsidy
- 411: Rental with subsidy
- 421: Owned without subsidy
- 422: Owned with subsidy

## Common Query Patterns

### Basic Client Demographics
```sql
SELECT 
  c."PersonalID",
  c."FirstName",
  c."LastName",
  c."DOB"::date as birth_date,
  CASE c."VeteranStatus" 
    WHEN 1 THEN 'Yes'
    WHEN 0 THEN 'No'
    ELSE 'Unknown'
  END as is_veteran
FROM "Client" c
WHERE c."DateDeleted" IS NULL;
```

### Active Enrollments
```sql
SELECT 
  c."PersonalID",
  c."FirstName",
  c."LastName",
  e."EnrollmentID",
  e."EntryDate"::date as entry_date,
  p."ProjectName",
  p."ProjectType"
FROM "Client" c
JOIN "Enrollment" e ON c."PersonalID" = e."PersonalID"
JOIN "Project" p ON e."ProjectID" = p."ProjectID"
LEFT JOIN "Exit" ex ON e."EnrollmentID" = ex."EnrollmentID"
WHERE ex."ExitDate" IS NULL
  AND c."DateDeleted" IS NULL
  AND e."DateDeleted" IS NULL;
```

### Income Analysis
```sql
SELECT 
  c."PersonalID",
  ib."InformationDate"::date,
  ib."TotalMonthlyIncome",
  ib."Earned",
  ib."EarnedAmount",
  ib."SSI",
  ib."SSIAmount"
FROM "Client" c
JOIN "IncomeBenefits" ib ON c."PersonalID" = ib."PersonalID"
WHERE c."DateDeleted" IS NULL
  AND ib."DateDeleted" IS NULL
ORDER BY ib."InformationDate"::date DESC;
```

### Project Outcomes
```sql
SELECT 
  p."ProjectName",
  p."ProjectType",
  COUNT(e."EnrollmentID") as total_enrollments,
  COUNT(ex."ExitID") as total_exits,
  AVG(EXTRACT(EPOCH FROM (ex."ExitDate"::timestamp - e."EntryDate"::timestamp))/86400)::integer as avg_days_enrolled
FROM "Project" p
JOIN "Enrollment" e ON p."ProjectID" = e."ProjectID"
LEFT JOIN "Exit" ex ON e."EnrollmentID" = ex."EnrollmentID"
WHERE p."DateDeleted" IS NULL
  AND e."DateDeleted" IS NULL
GROUP BY p."ProjectID", p."ProjectName", p."ProjectType";
```

## PostgreSQL Notes

### Date Handling
- Dates are stored as TEXT in ISO format (YYYY-MM-DD)
- Use ::date cast for date comparisons: "EntryDate"::date
- Date arithmetic requires timestamp cast:
  ```sql
  EXTRACT(EPOCH FROM ("ExitDate"::timestamp - "EntryDate"::timestamp))/86400
  ```

### Null Handling
- Use IS NULL/IS NOT NULL (not = NULL)
- Deleted records have "DateDeleted" IS NOT NULL
- Active enrollments have no corresponding exit record

### Case Sensitivity
- Always use double quotes for table/column names
- String comparisons are case-sensitive by default
- Use ILIKE for case-insensitive matching

### Best Practices
- Always include DateDeleted IS NULL checks
- Join through Enrollment table to connect clients and services
- Use appropriate date casts for temporal calculations
- Include appropriate indexes on join and filter columns
