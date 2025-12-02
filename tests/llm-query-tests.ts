import { queryData } from '../lib/ai/tools/query-data';

/**
 * Test cases for verifying LLM's SQL query understanding
 * Each test case includes:
 * - A natural language question
 * - Expected tables to be queried
 * - Expected filters/conditions
 * - Sample expected results structure
 */

const testCases = [
  {
    description: "Basic Client Demographics",
    question: "How many clients do we have by gender?",
    expectedTables: ["Client"],
    expectedFilters: ["DateDeleted IS NULL"],
    sampleQuery: `
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
    `
  },
  {
    description: "Active Project Enrollments",
    question: "Show me all currently active enrollments in emergency shelters",
    expectedTables: ["Client", "Enrollment", "Project", "Exit"],
    expectedFilters: [
      "DateDeleted IS NULL",
      "ProjectType IN (0, 1)", // Emergency Shelter types
      "ExitDate IS NULL" // Active enrollments
    ],
    sampleQuery: `
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
        AND p."ProjectType" IN (0, 1)
        AND c."DateDeleted" IS NULL
        AND e."DateDeleted" IS NULL
        AND p."DateDeleted" IS NULL;
    `
  },
  {
    description: "Income Analysis",
    question: "What is the average monthly income for clients who entered in 2024?",
    expectedTables: ["Client", "Enrollment", "IncomeBenefits"],
    expectedFilters: [
      "DateDeleted IS NULL",
      "EntryDate >= '2024-01-01'",
      "DataCollectionStage = 1" // Entry assessment
    ],
    sampleQuery: `
      SELECT 
        COUNT(DISTINCT c."PersonalID") as total_clients,
        ROUND(AVG(COALESCE(ib."TotalMonthlyIncome", 0)), 2) as avg_monthly_income,
        COUNT(CASE WHEN ib."IncomeFromAnySource" = 1 THEN 1 END) as clients_with_income
      FROM "Client" c
      JOIN "Enrollment" e ON c."PersonalID" = e."PersonalID"
      LEFT JOIN "IncomeBenefits" ib ON e."EnrollmentID" = ib."EnrollmentID"
      WHERE c."DateDeleted" IS NULL
        AND e."DateDeleted" IS NULL
        AND ib."DateDeleted" IS NULL
        AND e."EntryDate"::date >= '2024-01-01'
        AND ib."DataCollectionStage" = 1;
    `
  },
  {
    description: "Complex Project Outcomes",
    question: "What percentage of clients exit to permanent housing from each project type?",
    expectedTables: ["Project", "Enrollment", "Exit"],
    expectedFilters: [
      "DateDeleted IS NULL",
      "Destination BETWEEN 400 AND 499" // Permanent Housing destinations
    ],
    sampleQuery: `
      WITH ExitCounts AS (
        SELECT 
          p."ProjectType",
          COUNT(DISTINCT e."EnrollmentID") as total_exits,
          COUNT(DISTINCT CASE 
            WHEN ex."Destination" BETWEEN 400 AND 499 
            THEN e."EnrollmentID" 
          END) as permanent_housing_exits
        FROM "Project" p
        JOIN "Enrollment" e ON p."ProjectID" = e."ProjectID"
        JOIN "Exit" ex ON e."EnrollmentID" = ex."EnrollmentID"
        WHERE p."DateDeleted" IS NULL
          AND e."DateDeleted" IS NULL
          AND ex."DateDeleted" IS NULL
        GROUP BY p."ProjectType"
      )
      SELECT 
        "ProjectType",
        total_exits,
        permanent_housing_exits,
        ROUND(100.0 * permanent_housing_exits / NULLIF(total_exits, 0), 1) as ph_percentage
      FROM ExitCounts
      ORDER BY ph_percentage DESC NULLS LAST;
    `
  },
  {
    description: "Service Analysis",
    question: "What types of services were provided in the last month, and how many clients received each type?",
    expectedTables: ["Services", "Client"],
    expectedFilters: [
      "DateDeleted IS NULL",
      "DateProvided >= date_trunc('month', current_date - interval '1 month')"
    ],
    sampleQuery: `
      SELECT 
        s."TypeProvided",
        COUNT(*) as service_count,
        COUNT(DISTINCT s."PersonalID") as unique_clients,
        SUM(COALESCE(s."FAAmount", 0)) as total_financial_assistance
      FROM "Services" s
      WHERE s."DateDeleted" IS NULL
        AND s."DateProvided"::date >= date_trunc('month', current_date - interval '1 month')
      GROUP BY 1
      ORDER BY service_count DESC;
    `
  }
];

/**
 * Run through test cases and verify LLM's understanding
 * This is a manual process where you:
 * 1. Ask the LLM each question
 * 2. Compare its generated query with the expected structure
 * 3. Verify the results make sense
 * 4. Document any discrepancies or improvements needed
 */

console.log("HMIS LLM Query Test Cases");
console.log("=========================\n");

testCases.forEach((test, index) => {
  console.log(`Test Case ${index + 1}: ${test.description}`);
  console.log(`Question: "${test.question}"`);
  console.log("Expected Tables:", test.expectedTables.join(", "));
  console.log("Expected Filters:", test.expectedFilters.join(", "));
  console.log("\nSample Query:");
  console.log(test.sampleQuery);
  console.log("\n---\n");
});

/**
 * To use this test suite:
 * 
 * 1. Ask the LLM each question
 * 2. Compare its response to:
 *    - Tables used
 *    - Filters applied
 *    - Query structure
 *    - Results format
 * 3. Check for:
 *    - Proper table/column quoting
 *    - Date handling
 *    - NULL checks
 *    - Appropriate joins
 *    - Use of lookup tables
 *    - Performance considerations
 * 4. Document any areas where the LLM:
 *    - Misses important tables
 *    - Forgets filters
 *    - Uses incorrect syntax
 *    - Could improve query structure
 */
