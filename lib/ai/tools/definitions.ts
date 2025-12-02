import { z } from "zod";
import { queryData } from "./query-data";

export const queryDataSchema = z.object({
  sql: z.string().describe("PostgreSQL-compatible SQL query"),
  explanation: z.string().optional().describe("What this query does")
});

export const queryDataTool = {
  description: "Execute SQL query on the HMIS database",
  inputSchema: queryDataSchema,
  execute: queryData
};
