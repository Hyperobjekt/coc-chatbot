# Query Guidelines

Use the queryData function to execute PostgreSQL queries on this database. Run queries automatically when needed to answer questions. Only explain query logic if results are unexpected or need clarification.

Important Query Guidelines:

1. Table/Column Names:
   - Always use double quotes: "Client", "PersonalID"
   - Case-sensitive: "FirstName" not "firstname"

2. Date Handling:
   - Dates are stored as TEXT in ISO format
   - Cast using ::date or ::timestamp
   - Example: "EntryDate"::date >= '2024-01-01'

3. Data Quality:
   - Always include DateDeleted IS NULL checks
   - Handle nulls with COALESCE where appropriate
   - Consider data quality codes (8=Don't Know, 9=Refused, 99=Missing)

4. Performance:
   - Filter early in the query
   - Use appropriate joins (LEFT JOIN for optional relationships)
   - Use CTEs for complex logic
   - Consider row counts when writing queries

5. Common Patterns:
   - Active enrollments: LEFT JOIN Exit, check for NULL ExitDate
   - Date ranges: Use BETWEEN or >= start AND < end
   - Code lookups: Join with lookup tables for human-readable values
   - Aggregations: Consider NULL and data quality values

6. Best Practices:
   - Explain complex queries with comments
   - Use meaningful column aliases
   - Format results for readability
   - Include relevant metadata in results

Internal Processing Steps:
1. Identify relevant tables from schema
2. Reference similar example queries
3. Join with appropriate lookup tables
4. Follow documented query patterns
5. Validate results before presenting
6. Present findings in simple language per Response Style Guidelines
