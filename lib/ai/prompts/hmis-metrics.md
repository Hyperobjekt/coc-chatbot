# HMIS Metrics and Resolution Guide

## HMIS Detailed Metrics

| Metric                  | Description                                                                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Episodic Homelessness   | Unduplicated count of individuals with 4 or more project entries of any type within the past 4 years.                                                                                                                                                  |
| Length of Time Homeless | Average number of days from earliest active project entry to current date for all actively homeless individuals.                                                                                                                                       |
| Length of Stay          | Average number of days from project entry to current date for all actively homeless individuals in projects with any project type.                                                                                                                     |
| Unsheltered Count       | Unduplicated count of individuals actively homeless in any project except ES, SH, or TH with a current living situation location not meant for habitation.                                                                                             |
| Self-Resolution         | Unduplicated count of individuals with positive exit destinations without an entry in any project with a PH project type.                                                                                                                              |
| Rapid Resolution        | Unduplicated count of individuals with 3 or fewer service transactions per project exit, with no project stay longer than 60 days, with 3 or fewer total project entries in any project.                                                               |
| Long Stayers            | Unduplicated count of individuals in a project with a Coordinated Entry project type, with a length of stay over 90 days before the current date, with no other project entries with entry dates on or after the Coordinated Entry project start date. |

## Self-Resolution and Rapid Resolution Identification Guide

### Self-Resolution

**Definition**: Unduplicated count of individuals with positive exit destinations without an entry in any project with a PH project type.

**Identification Logic**:

```sql
SELECT DISTINCT e."PersonalID"
FROM "Exit" e
JOIN "Enrollment" enr ON e."EnrollmentID" = enr."EnrollmentID"
JOIN "Project" p ON enr."ProjectID" = p."ProjectID"
WHERE
    -- Has positive exit destination
    e."Destination" IN (
        3,   -- Permanent housing (other than RRH)
        10,  -- Rental by client (VASH subsidy)
        11,  -- Owned by client (VASH subsidy)
        19,  -- Rental by client (other subsidy)
        20,  -- Rental by client (no subsidy)
        21,  -- Owned by client (no subsidy)
        22,  -- Staying with family (permanent)
        23,  -- Staying with friends (permanent)
        26,  -- Moved from one HOPWA-funded project to PH
        28   -- Residential project with ongoing housing subsidy
    )
    -- Has NO enrollments in Permanent Housing projects
    AND e."PersonalID" NOT IN (
        SELECT DISTINCT e2."PersonalID"
        FROM "Enrollment" e2
        JOIN "Project" p2 ON e2."ProjectID" = p2."ProjectID"
        WHERE p2."ProjectType" IN (3, 9, 10, 13)
        -- PH types: PSH=3, RRH=9, Safe Haven=10, PH-Housing Only=13
    )
```

### Rapid Resolution

**Definition**: Unduplicated count of individuals with 3 or fewer service transactions per project exit, with no project stay longer than 60 days, with 3 or fewer total project entries in any project.

**Identification Logic**:

```sql
-- Step 1: Calculate metrics per client
WITH client_metrics AS (
    SELECT
        c."PersonalID",
        COUNT(DISTINCT e."EnrollmentID") as total_enrollments,
        MAX(EXTRACT(EPOCH FROM (COALESCE(ex."ExitDate", CURRENT_DATE)::timestamp -
                               e."EntryDate"::timestamp))/86400) as max_stay_days
    FROM "Client" c
    JOIN "Enrollment" e ON c."PersonalID" = e."PersonalID"
    LEFT JOIN "Exit" ex ON e."EnrollmentID" = ex."EnrollmentID"
    WHERE e."DateDeleted" IS NULL
    AND (ex."DateDeleted" IS NULL OR ex."DateDeleted" IS NOT NULL)
    GROUP BY c."PersonalID"
),

-- Step 2: Count service transactions per enrollment
service_counts AS (
    SELECT
        e."EnrollmentID",
        e."PersonalID",
        COUNT(s."ServicesID") as service_transactions
    FROM "Enrollment" e
    LEFT JOIN "Services" s ON e."EnrollmentID" = s."EnrollmentID"
    WHERE e."DateDeleted" IS NULL
    AND (s."DateDeleted" IS NULL OR s."DateDeleted" IS NOT NULL)
    GROUP BY e."EnrollmentID", e."PersonalID"
)

-- Step 3: Apply all three criteria
SELECT DISTINCT cm."PersonalID"
FROM client_metrics cm
JOIN service_counts sc ON cm."PersonalID" = sc."PersonalID"
WHERE
    cm.total_enrollments <= 3           -- Criterion 3: 3 or fewer project entries
    AND cm.max_stay_days <= 60          -- Criterion 2: No stay > 60 days
    AND sc.service_transactions <= 3     -- Criterion 1: 3 or fewer services per exit
```

## Diversion Query Instructions

When analyzing candidates for diversion efforts:

1. **Primary Focus**: Identify individuals who achieve Rapid Resolution or Self-Resolution as the best candidates for diversion.

2. **Required Analysis**:

   - MUST query actual HMIS data to identify demographic patterns
   - Analyze age distributions, prior living situations, disability status, and other relevant factors
   - Report concrete statistics from the data (e.g., "X% of successful rapid resolutions were among adults aged 18-24")
   - Include statistical significance where relevant

3. **Data Sources**:

   - Use Client demographics table for age, gender, race, etc.
   - Use Enrollment/Exit data for patterns in length of stay and outcomes
   - Use Services data to analyze level of support needed
   - Cross-reference with Assessment data for additional patterns

4. **Response Format**:
   - Start with clear definition of Rapid/Self-Resolution
   - Present data-backed demographic findings
   - Include specific percentages and counts
   - Highlight statistically significant patterns
   - NO generic statements without data support
