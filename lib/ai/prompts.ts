import fs from "node:fs";
import path from "node:path";
import type { Geo } from "@vercel/functions";
import { getCustomPrompt } from "./custom-prompt";
import { regularPrompt } from "./regular-prompt";

// Load our enhanced documentation files
const schemaDoc = fs.readFileSync(
  path.join(process.cwd(), "database/schema.md"),
  "utf-8"
);
const lookupTablesDoc = fs.readFileSync(
  path.join(process.cwd(), "database/lookup-tables.md"),
  "utf-8"
);
const commonQueriesDoc = fs.readFileSync(
  path.join(process.cwd(), "database/common-queries.md"),
  "utf-8"
);


export type RequestHints = {
  latitude: Geo["latitude"];
  longitude: Geo["longitude"];
  city: Geo["city"];
  country: Geo["country"];
};

export type DatabaseContext = {
  schema: any;
  documentation: string;
};

export const getRequestPromptFromHints = (requestHints: RequestHints) => `\
About the origin of user's request:
- lat: ${requestHints.latitude}
- lon: ${requestHints.longitude}
- city: ${requestHints.city}
- country: ${requestHints.country}
`;

export const systemPrompt = async ({
  requestHints,
  databaseContext,
}: {
  selectedChatModel: string;
  requestHints: RequestHints;
  databaseContext?: DatabaseContext;
}) => {
  const [customPrompt, requestPrompt] = await Promise.all([
    getCustomPrompt(),
    Promise.resolve(getRequestPromptFromHints(requestHints))
  ]);

  let prompt = `${customPrompt ?? regularPrompt}\n\n${requestPrompt}`;

  if (databaseContext) {
    prompt += "\n\n# HMIS Database Documentation\n\n";

    // Add schema documentation
    prompt += `## Schema Overview\n${schemaDoc}\n\n`;

    // Add lookup tables
    prompt += `## Lookup Tables & Code Mappings\n${lookupTablesDoc}\n\n`;

    // Add example queries
    prompt += `## Query Examples\n${commonQueriesDoc}\n\n`;

    prompt += `Use the queryData function to execute PostgreSQL queries on this database. Always explain what each query does.

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
5. Explain your query logic clearly`;
  }

  return prompt;
};

export const titlePrompt = `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`;

// Stub prompts for artifacts (not currently used)
export const codePrompt = "Create code based on the user's request";
export const sheetPrompt = "Create a spreadsheet based on the user's request";
export const updateDocumentPrompt = (content: string, type: string) =>
  `Update the ${type} document based on the user's request. Current content: ${content}`;
