import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import fs from "fs";
import path from "path";
import postgres from "postgres";

config({
  path: ".env.local",
});

// Load schema and documentation once at startup
const schema = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "schema.json"), "utf-8")
);
const documentation = fs.readFileSync(
  path.join(process.cwd(), "documentation.txt"),
  "utf-8"
);

// Initialize database connection
if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined");
}

const connection = postgres(process.env.POSTGRES_URL);
const db = drizzle(connection);

interface QueryDataParams {
  sql: string;
  explanation?: string;
}

export async function queryData({ sql, explanation }: QueryDataParams) {
  try {
    // Execute the query
    const results = (await connection.unsafe(sql)) as Record<string, unknown>[];

    // Format results for display
    const formattedResults = {
      query: sql,
      explanation: explanation || "No explanation provided",
      rowCount: results.length,
      results: results.slice(0, 100), // Limit to first 100 rows for display
      truncated: results.length > 100,
      columns: results.length > 0 ? Object.keys(results[0] as object) : [],
    };

    return formattedResults;
  } catch (error) {
    if (error instanceof Error) {
      // Extract useful info from common Postgres errors
      const msg = error.message;
      if (msg.includes("relation") && msg.includes("does not exist")) {
        throw new Error(
          `Table not found - check table name and case sensitivity. PostgreSQL error: ${msg}`
        );
      }
      if (msg.includes("column") && msg.includes("does not exist")) {
        throw new Error(
          `Column not found - check column name and case sensitivity. PostgreSQL error: ${msg}`
        );
      }
      if (msg.includes("syntax error")) {
        throw new Error(
          `SQL syntax error - ensure you're using PostgreSQL syntax. PostgreSQL error: ${msg}`
        );
      }
      throw new Error(`Query failed: ${msg}`);
    }
    throw new Error("Query failed: Unknown error");
  }
}

// Helper to get schema and documentation for system prompt
export function getContext() {
  return {
    schema,
    documentation,
  };
}

// Clean up database connection on process exit
process.on("exit", async () => {
  await connection.end();
});
