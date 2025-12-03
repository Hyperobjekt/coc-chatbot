# Query Guidelines

Internal guidelines for database queries. Focus on getting accurate results quickly.

1. Technical Requirements
   - Use double quotes for tables/columns: "Client", "PersonalID"
   - Cast dates: "EntryDate"::date
   - Always check DateDeleted IS NULL
   - Handle data quality codes (8=Don't Know, 9=Refused, 99=Missing)

2. Query Structure
   - Filter first
   - Use LEFT JOIN for optional data
   - Join with lookup tables for readable values
   - Use CTEs for complex logic

3. Common Patterns
   - Active enrollments: WHERE "ExitDate" IS NULL
   - Date ranges: BETWEEN or >= start AND < end
   - Aggregations: GROUP BY with COALESCE

4. Response Format
   - Only explain queries if results are unexpected
   - Show the most relevant numbers first
   - Round percentages to whole numbers
   - Use counts/totals that directly support the answer
