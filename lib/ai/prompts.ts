import fs from "node:fs";
import path from "node:path";

const loadFile = (filePath: string): string => {
  return fs.readFileSync(path.join(process.cwd(), filePath), "utf-8");
};

// Load all documentation and prompt files
const docs = {
  hmis: loadFile("documentation.txt"),
  schema: loadFile("database/schema.md"),
  lookupTables: loadFile("database/lookup-tables.md"),
  commonQueries: loadFile("database/common-queries.md"),
  systemPrompt: loadFile("lib/ai/prompts/system-prompt.md"),
  queryGuidelines: loadFile("lib/ai/prompts/query-guidelines.md"),
  titleGeneration: loadFile("lib/ai/prompts/title-generation.md")
};

export const systemPrompt = () => {
  return [
    docs.systemPrompt,
    docs.hmis,
    docs.schema,
    docs.lookupTables,
    docs.commonQueries,
    docs.queryGuidelines
  ].join('\n\n');
};

export const titlePrompt = docs.titleGeneration;

// Stub prompts for artifacts (not currently used)
export const codePrompt = "Create code based on the user's request";
export const sheetPrompt = "Create a spreadsheet based on the user's request";
export const updateDocumentPrompt = (content: string, type: string) =>
  `Update the ${type} document based on the user's request. Current content: ${content}`;
