# Query Guidelines

Use the queryData function to execute PostgreSQL queries on this database. Always explain what each query does.

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

When users ask questions, try to:
1. Identify the relevant tables from the schema
2. Check for similar example queries
3. Use appropriate lookup tables for coded values
4. Follow the query patterns in the documentation
5. Explain your query logic clearly
