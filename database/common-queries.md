# HMIS Common Query Examples

This document provides example queries for common HMIS reporting and analysis needs, along with sample results and explanations.

## Client Demographics

### 1. Basic Client Count by Gender
```sql
SELECT 
  CASE 
    WHEN "Woman" = 1 THEN 'Woman'
    WHEN "Man" = 1 THEN 'Man'
    WHEN "NonBinary" = 1 THEN 'Non-Binary'
    WHEN "DifferentIdentity" = 1 THEN 'Different Identity'
    ELSE 'Not Reported'
  END as gender,
  COUNT(*) as client_count
FROM "Client"
WHERE "DateDeleted" IS NULL
GROUP BY 1
ORDER BY client_count DESC;
```
**Sample Result:**
```
gender          | client_count
----------------|-------------
Man             | 2341
Woman           | 1583
Non-Binary      | 156
Different ID    | 45
Not Reported    | 21
```

### 2. Age Distribution at Project Entry
```sql
WITH client_ages AS (
  SELECT 
    EXTRACT(YEAR FROM AGE(CURRENT_DATE::date, c."DOB"::date)) as age
  FROM "Client" c
  JOIN "Enrollment" e ON c."PersonalID" = e."PersonalID"
  WHERE c."DateDeleted" IS NULL 
    AND e."DateDeleted" IS NULL
),
age_groups AS (
  SELECT 
    CASE 
      WHEN age < 18 THEN 'Under 18' 
      WHEN age BETWEEN 18 AND 24 THEN '18-24' 
      WHEN age BETWEEN 25 AND 34 THEN '25-34' 
      WHEN age BETWEEN 35 AND 44 THEN '35-44' 
      WHEN age BETWEEN 45 AND 54 THEN '45-54' 
      WHEN age BETWEEN 55 AND 61 THEN '55-61' 
      WHEN age >= 62 THEN '62 and older' 
      ELSE 'Unknown' 
    END as age_group,
    COUNT(*) as client_count 
  FROM client_ages
  GROUP BY 1
)
SELECT 
  age_group,
  client_count
FROM age_groups
ORDER BY 
  CASE age_group
    WHEN 'Under 18' THEN 1 
    WHEN '18-24' THEN 2 
    WHEN '25-34' THEN 3 
    WHEN '35-44' THEN 4 
    WHEN '45-54' THEN 5 
    WHEN '55-61' THEN 6 
    WHEN '62 and older' THEN 7 
    ELSE 8 
  END;
```
**Sample Result:**
```
age_group     | client_count
--------------|-------------
Under 18      | 523
18-24         | 892
25-34         | 1245
35-44         | 756
45-54         | 423
55-61         | 189
62 and older  | 118
```

## Project Performance

### 3. Average Length of Stay by Project Type
```sql
SELECT 
  p."ProjectType",
  COUNT(DISTINCT e."EnrollmentID") as total_enrollments,
  ROUND(AVG(
    CASE 
      WHEN ex."ExitDate" IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (ex."ExitDate"::timestamp - e."EntryDate"::timestamp))/86400
      ELSE EXTRACT(EPOCH FROM (CURRENT_DATE::timestamp - e."EntryDate"::timestamp))/86400
    END
  )) as avg_days_enrolled
FROM "Project" p
JOIN "Enrollment" e ON p."ProjectID" = e."ProjectID"
LEFT JOIN "Exit" ex ON e."EnrollmentID" = ex."EnrollmentID"
WHERE p."DateDeleted" IS NULL
  AND e."DateDeleted" IS NULL
GROUP BY 1
ORDER BY 1;
```

### 4. Exit Destinations Analysis
```sql
WITH ExitCounts AS (
  SELECT 
    p."ProjectType",
    CASE 
      WHEN ex."Destination" BETWEEN 400 AND 499 THEN 'Permanent Housing'
      WHEN ex."Destination" BETWEEN 300 AND 399 THEN 'Temporary Housing'
      WHEN ex."Destination" BETWEEN 200 AND 299 THEN 'Institutional'
      WHEN ex."Destination" BETWEEN 100 AND 199 THEN 'Homeless'
      ELSE 'Other/Unknown'
    END as destination_type,
    COUNT(*) as exit_count
  FROM "Project" p
  JOIN "Enrollment" e ON p."ProjectID" = e."ProjectID"
  JOIN "Exit" ex ON e."EnrollmentID" = ex."EnrollmentID"
  WHERE p."DateDeleted" IS NULL
    AND e."DateDeleted" IS NULL
    AND ex."DateDeleted" IS NULL
  GROUP BY 1, 2
)
SELECT 
  "ProjectType",
  destination_type,
  exit_count,
  ROUND(100.0 * exit_count / SUM(exit_count) OVER (PARTITION BY "ProjectType"), 1) as percentage
FROM ExitCounts
ORDER BY 1, 4 DESC;
```

## Income & Benefits Analysis

### 5. Income Change During Enrollment
```sql
WITH IncomeAtEntry AS (
  SELECT 
    e."EnrollmentID",
    ib."TotalMonthlyIncome" as entry_income
  FROM "Enrollment" e
  LEFT JOIN "IncomeBenefits" ib ON e."EnrollmentID" = ib."EnrollmentID"
  WHERE ib."DataCollectionStage" = 1  -- Project Start
    AND e."DateDeleted" IS NULL
    AND ib."DateDeleted" IS NULL
),
IncomeAtExit AS (
  SELECT 
    e."EnrollmentID",
    ib."TotalMonthlyIncome" as exit_income
  FROM "Enrollment" e
  LEFT JOIN "IncomeBenefits" ib ON e."EnrollmentID" = ib."EnrollmentID"
  WHERE ib."DataCollectionStage" = 3  -- Project Exit
    AND e."DateDeleted" IS NULL
    AND ib."DateDeleted" IS NULL
)
SELECT 
  CASE 
    WHEN exit_income > entry_income THEN 'Increased'
    WHEN exit_income < entry_income THEN 'Decreased'
    WHEN exit_income = entry_income THEN 'No Change'
    ELSE 'Missing Data'
  END as income_change,
  COUNT(*) as client_count,
  ROUND(AVG(COALESCE(exit_income, 0) - COALESCE(entry_income, 0)), 2) as avg_change
FROM "Enrollment" e
LEFT JOIN IncomeAtEntry ie ON e."EnrollmentID" = ie."EnrollmentID"
LEFT JOIN IncomeAtExit ix ON e."EnrollmentID" = ix."EnrollmentID"
WHERE e."DateDeleted" IS NULL
GROUP BY 1
ORDER BY client_count DESC;
```

## Household & Family Analysis

### 6. Household Composition
```sql
SELECT 
  CASE 
    WHEN COUNT(*) = 1 THEN 'Single Individual'
    WHEN COUNT(*) = 2 THEN 'Two Person Household'
    WHEN COUNT(*) > 2 THEN 'Three or More Person Household'
  END as household_type,
  COUNT(DISTINCT e."HouseholdID") as household_count
FROM "Enrollment" e
WHERE e."DateDeleted" IS NULL
GROUP BY e."HouseholdID"
HAVING COUNT(*) >= 1
ORDER BY household_count DESC;
```

## Service Delivery Analysis

### 7. Services by Type and Month
```sql
SELECT 
  DATE_TRUNC('month', s."DateProvided"::date) as service_month,
  s."TypeProvided",
  COUNT(*) as service_count,
  COUNT(DISTINCT s."PersonalID") as unique_clients,
  SUM(COALESCE(s."FAAmount", 0)) as total_financial_assistance
FROM "Services" s
WHERE s."DateDeleted" IS NULL
  AND s."DateProvided"::date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY 1, 2
ORDER BY 1 DESC, 2;
```

## Complex Analysis Examples

### 8. Returns to Homelessness
```sql
WITH ExitsToPH AS (
  SELECT 
    e."PersonalID",
    e."EnrollmentID",
    ex."ExitDate"::date as ph_exit_date
  FROM "Enrollment" e
  JOIN "Exit" ex ON e."EnrollmentID" = ex."EnrollmentID"
  WHERE ex."Destination" BETWEEN 400 AND 499  -- Permanent Housing
    AND e."DateDeleted" IS NULL
    AND ex."DateDeleted" IS NULL
),
SubsequentHomeless AS (
  SELECT 
    eph."PersonalID",
    eph."ph_exit_date",
    MIN(e."EntryDate"::date) as return_date
  FROM ExitsToPH eph
  JOIN "Enrollment" e ON eph."PersonalID" = e."PersonalID"
  WHERE e."EntryDate"::date > eph."ph_exit_date"
    AND e."DateDeleted" IS NULL
  GROUP BY 1, 2
)
SELECT 
  CASE 
    WHEN return_date IS NULL THEN 'No Return'
    WHEN return_date - ph_exit_date <= 180 THEN 'Within 6 months'
    WHEN return_date - ph_exit_date <= 365 THEN '6-12 months'
    WHEN return_date - ph_exit_date <= 730 THEN '1-2 years'
    ELSE 'Over 2 years'
  END as time_to_return,
  COUNT(*) as client_count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) as percentage
FROM ExitsToPH
LEFT JOIN SubsequentHomeless USING ("PersonalID", "ph_exit_date")
GROUP BY 1
ORDER BY 
  CASE time_to_return
    WHEN 'Within 6 months' THEN 1
    WHEN '6-12 months' THEN 2
    WHEN '1-2 years' THEN 3
    WHEN 'Over 2 years' THEN 4
    ELSE 5
  END;
```

### 9. Chronic Homelessness Determination
```sql
WITH ClientStays AS (
  SELECT 
    e."PersonalID",
    e."EntryDate"::date as entry_date,
    COALESCE(ex."ExitDate"::date, CURRENT_DATE) as exit_date,
    e."TimesHomelessPastThreeYears",
    e."MonthsHomelessPastThreeYears",
    e."DisablingCondition"
  FROM "Enrollment" e
  LEFT JOIN "Exit" ex ON e."EnrollmentID" = ex."EnrollmentID"
  WHERE e."DateDeleted" IS NULL
    AND (ex."DateDeleted" IS NULL OR ex."DateDeleted" IS NOT NULL)
),
HomelessDuration AS (
  SELECT 
    "PersonalID",
    SUM(exit_date - entry_date) as total_days_homeless,
    MAX("DisablingCondition") as has_disability,
    MAX("TimesHomelessPastThreeYears") as episodes,
    MAX("MonthsHomelessPastThreeYears") as months_homeless
  FROM ClientStays
  GROUP BY 1
)
SELECT 
  CASE 
    WHEN has_disability = 1 
      AND (total_days_homeless >= 365 
        OR months_homeless >= 12)
      AND episodes >= 4
    THEN 'Chronically Homeless'
    ELSE 'Not Chronically Homeless'
  END as chronic_status,
  COUNT(*) as client_count
FROM HomelessDuration
GROUP BY 1;
```

## Usage Notes

1. Always include `DateDeleted IS NULL` checks
2. Cast dates appropriately using `::date` or `::timestamp`
3. Consider data quality (nulls, unknown values) in aggregations
4. Use appropriate joins based on relationship cardinality
5. Include appropriate indexes on commonly filtered/joined columns
6. Consider performance with large datasets:
   - Use CTEs for complex logic
   - Filter early in the query
   - Use appropriate indexes
   - Consider materialized views for complex calculations
