#!/usr/bin/env tsx
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import fs from "fs";
import Papa from "papaparse";
import path from "path";
import { PDFParse } from "pdf-parse";
import postgres from "postgres";
import * as schema from "../lib/db/schema";

config({
  path: ".env.local",
});

// Lookup table data
const livingSituations = [
  // Emergency Shelter/Safe Haven (1-99)
  { Code: 8, Category: "Emergency Shelter", Description: "Emergency shelter" },
  { Code: 9, Category: "Safe Haven", Description: "Safe Haven" },

  // Homeless Situations (100-199)
  {
    Code: 116,
    Category: "Homeless",
    Description: "Place not meant for habitation",
  },
  {
    Code: 101,
    Category: "Homeless",
    Description: "Emergency shelter, including hotel/motel paid with voucher",
  },
  { Code: 118, Category: "Homeless", Description: "Safe Haven" },

  // Institutional Situations (200-299)
  {
    Code: 204,
    Category: "Institutional",
    Description: "Psychiatric hospital or facility",
  },
  {
    Code: 205,
    Category: "Institutional",
    Description: "Substance abuse treatment facility",
  },
  { Code: 206, Category: "Institutional", Description: "Hospital" },
  {
    Code: 207,
    Category: "Institutional",
    Description: "Jail, prison or juvenile detention",
  },
  { Code: 215, Category: "Institutional", Description: "Foster care home" },
  {
    Code: 225,
    Category: "Institutional",
    Description: "Long-term care facility",
  },

  // Temporary Housing (300-399)
  { Code: 302, Category: "Temporary", Description: "Transitional housing" },
  {
    Code: 314,
    Category: "Temporary",
    Description: "Hotel/motel without voucher",
  },
  { Code: 329, Category: "Temporary", Description: "Residential program" },
  { Code: 332, Category: "Temporary", Description: "Host home" },
  {
    Code: 335,
    Category: "Temporary",
    Description: "Staying with family, temporary",
  },
  {
    Code: 336,
    Category: "Temporary",
    Description: "Staying with friends, temporary",
  },

  // Permanent Housing (400-499)
  {
    Code: 410,
    Category: "Permanent",
    Description: "Rental by client, no subsidy",
  },
  {
    Code: 411,
    Category: "Permanent",
    Description: "Rental by client, with subsidy",
  },
  { Code: 421, Category: "Permanent", Description: "Owned by client" },
  { Code: 435, Category: "Permanent", Description: "Permanent housing" },
];

const projectTypes = [
  { Code: 0, Description: "Emergency Shelter - Entry Exit" },
  { Code: 1, Description: "Emergency Shelter - Night-by-Night" },
  { Code: 2, Description: "Transitional Housing" },
  { Code: 3, Description: "PH - Permanent Supportive Housing" },
  { Code: 4, Description: "Street Outreach" },
  { Code: 6, Description: "Services Only" },
  { Code: 7, Description: "Other" },
  { Code: 8, Description: "Safe Haven" },
  { Code: 9, Description: "PH - Housing Only" },
  { Code: 10, Description: "PH - Housing with Services" },
  { Code: 11, Description: "Day Shelter" },
  { Code: 12, Description: "Homelessness Prevention" },
  { Code: 13, Description: "PH - Rapid Re-Housing" },
  { Code: 14, Description: "Coordinated Entry" },
];

const destinations = [
  // Emergency Shelter/Safe Haven (1-99)
  { Code: 8, Category: "Emergency Shelter", Description: "Emergency shelter" },
  { Code: 9, Category: "Safe Haven", Description: "Safe Haven" },
  { Code: 17, Category: "Other", Description: "Other" },
  { Code: 24, Category: "Deceased", Description: "Deceased" },
  { Code: 30, Category: "Unknown", Description: "No exit interview completed" },
  { Code: 99, Category: "Unknown", Description: "Unknown/disappeared" },

  // Homeless Situations (100-199)
  {
    Code: 116,
    Category: "Homeless",
    Description: "Place not meant for habitation",
  },
  { Code: 101, Category: "Homeless", Description: "Emergency shelter" },
  { Code: 118, Category: "Homeless", Description: "Safe Haven" },

  // Institutional Settings (200-299)
  { Code: 204, Category: "Institutional", Description: "Psychiatric hospital" },
  {
    Code: 205,
    Category: "Institutional",
    Description: "Substance abuse facility",
  },
  { Code: 206, Category: "Institutional", Description: "Hospital" },
  { Code: 207, Category: "Institutional", Description: "Jail/prison" },
  { Code: 215, Category: "Institutional", Description: "Foster care" },
  {
    Code: 225,
    Category: "Institutional",
    Description: "Long-term care facility",
  },

  // Temporary Settings (300-399)
  { Code: 302, Category: "Temporary", Description: "Transitional housing" },
  {
    Code: 312,
    Category: "Temporary",
    Description: "Staying with family, temporary",
  },
  {
    Code: 313,
    Category: "Temporary",
    Description: "Staying with friends, temporary",
  },
  {
    Code: 314,
    Category: "Temporary",
    Description: "Hotel/motel without voucher",
  },
  { Code: 329, Category: "Temporary", Description: "Residential program" },
  { Code: 332, Category: "Temporary", Description: "Host home" },

  // Permanent Settings (400-499)
  {
    Code: 410,
    Category: "Permanent",
    Description: "Rental by client, no subsidy",
  },
  {
    Code: 411,
    Category: "Permanent",
    Description: "Rental by client, with subsidy",
  },
  { Code: 421, Category: "Permanent", Description: "Owned by client" },
  {
    Code: 422,
    Category: "Permanent",
    Description: "Owned by client, with subsidy",
  },
  {
    Code: 423,
    Category: "Permanent",
    Description: "Long-term rental assistance",
  },
  { Code: 435, Category: "Permanent", Description: "Permanent housing" },
];

const housingStatuses = [
  { Code: 1, Description: "Category 1 - Literally Homeless" },
  { Code: 2, Description: "Category 2 - Imminent Risk of Homelessness" },
  {
    Code: 3,
    Description: "Category 3 - Homeless under other Federal statutes",
  },
  { Code: 4, Description: "Category 4 - Fleeing domestic violence" },
  { Code: 5, Description: "At-risk of homelessness" },
  { Code: 6, Description: "Stably housed" },
];

const DATA_DIR = path.join(process.cwd(), "data");
const SCHEMA_PATH = path.join(process.cwd(), "schema.json");
const DOCS_PATH = path.join(process.cwd(), "documentation.txt");

interface TableSchema {
  name: string;
  columns: Array<{
    name: string;
    type: string;
  }>;
  rowCount: number;
}

// Get PostgreSQL type from value
function inferType(value: string): string {
  if (!value || value === "") return "text";

  // Check for integers
  if (/^\d+$/.test(value)) return "integer";

  // Check for floats
  if (/^\d+\.\d+$/.test(value)) return "numeric";

  // Check for dates (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "timestamp";

  return "text";
}

// Get most specific type from sample values
function getColumnType(values: string[]): string {
  const nonEmpty = values.filter((v) => v && v !== "");
  if (nonEmpty.length === 0) return "text";

  const types = nonEmpty.slice(0, 100).map(inferType);

  if (types.every((t) => t === "integer")) return "integer";
  if (types.every((t) => t === "integer" || t === "numeric")) return "numeric";
  if (types.every((t) => t === "timestamp")) return "timestamp";

  return "text";
}

async function loadCSVToDatabase(
  db: ReturnType<typeof drizzle>,
  csvPath: string,
  tableName: string
) {
  console.log(`Loading ${tableName}...`);

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });

  if (parsed.errors.length > 0) {
    console.warn(`Warnings for ${tableName}:`, parsed.errors.slice(0, 5));
  }

  const data = parsed.data as Record<string, string>[];
  if (data.length === 0) {
    console.log(`Skipping ${tableName} - no data`);
    return null;
  }

  const columns = Object.keys(data[0]);

  // Infer column types
  const columnTypes: Record<string, string> = {};
  for (const col of columns) {
    const values = data.map((row) => row[col] || "");
    columnTypes[col] = getColumnType(values);
  }

  // Convert data for insertion
  const rows = data.map((row) => {
    const converted: Record<string, any> = {};
    for (const [key, value] of Object.entries(row)) {
      if (value === "") {
        converted[key] = null;
      } else if (columnTypes[key] === "integer") {
        converted[key] = Number.parseInt(value) || null;
      } else if (columnTypes[key] === "numeric") {
        converted[key] = Number.parseFloat(value) || null;
      } else if (columnTypes[key] === "timestamp" && value) {
        // Keep dates as strings
        converted[key] = value;
      } else {
        converted[key] = value;
      }
    }
    return converted;
  });

  // Get the correct table name case from schema
  const schemaKeys = Object.keys(schema);
  // Special case for User.csv -> HMIS_User table
  const tableKey =
    tableName === "User"
      ? "user_"
      : schemaKeys.find((key) => key.toLowerCase() === tableName.toLowerCase());
  if (!tableKey) {
    throw new Error(`Table ${tableName} not found in schema`);
  }
  const table = (schema as any)[tableKey];

  // Calculate batch size based on number of columns to stay under Postgres parameter limit
  const columnCount = Object.keys(rows[0] || {}).length;
  const maxParamsPerRow = columnCount;
  const maxParams = 65_534; // Postgres limit
  const batchSize = Math.floor(maxParams / maxParamsPerRow);
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    try {
      await db.insert(table).values(batch).onConflictDoNothing();
      console.log(`  ✓ Inserted ${i + batch.length}/${rows.length} rows`);
    } catch (error) {
      console.warn(
        `  ⚠️ Error inserting batch ${i}-${i + batch.length}:`,
        error
      );
    }
  }

  console.log(`  ✓ Loaded ${rows.length} rows`);

  return {
    name: tableName,
    columns: columns.map((name) => ({
      name,
      type: columnTypes[name],
    })),
    rowCount: rows.length,
  };
}

async function extractPDFText(pdfPath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

async function seedLookupTables(db: ReturnType<typeof drizzle>) {
  console.log("\n📋 Seeding lookup tables...");

  // Insert living situations
  console.log("  Inserting living situations...");
  for (const situation of livingSituations) {
    await db
      .insert(schema.livingSituationLookup)
      .values(situation)
      .onConflictDoNothing();
  }

  // Insert project types
  console.log("  Inserting project types...");
  for (const type of projectTypes) {
    await db
      .insert(schema.projectTypeLookup)
      .values(type)
      .onConflictDoNothing();
  }

  // Insert destinations
  console.log("  Inserting destinations...");
  for (const destination of destinations) {
    await db
      .insert(schema.destinationLookup)
      .values(destination)
      .onConflictDoNothing();
  }

  // Insert housing statuses
  console.log("  Inserting housing statuses...");
  for (const status of housingStatuses) {
    await db
      .insert(schema.housingStatusLookup)
      .values(status)
      .onConflictDoNothing();
  }

  console.log("✓ Lookup tables seeded successfully!\n");
}

async function main() {
  console.log("🚀 Starting data loading...\n");

  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  // Initialize database connection
  const connection = postgres(process.env.POSTGRES_URL);
  const db = drizzle(connection);

  // Seed lookup tables first
  await seedLookupTables(db);

  // Load CSVs in correct order based on dependencies
  const loadOrder = [
    "Export",
    "Organization",
    "Project",
    "CEParticipation",
    "Client",
    "Enrollment",
    "Assessment",
    "Event",
    "Exit",
    "Services",
    "HealthAndDV",
    "IncomeBenefits",
    "EmploymentEducation",
    "CurrentLivingSituation",
    "ProjectCoC",
    "Inventory",
    "HMISParticipation",
    "Funder",
    "User",
    "YouthEducationStatus",
  ];

  const csvFiles = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".csv"))
    .sort((a, b) => {
      const aIndex = loadOrder.indexOf(a.replace(".csv", ""));
      const bIndex = loadOrder.indexOf(b.replace(".csv", ""));
      return aIndex - bIndex;
    });

  const schemas: TableSchema[] = [];

  for (const csvFile of csvFiles) {
    const tableName = csvFile.replace(".csv", "");
    const csvPath = path.join(DATA_DIR, csvFile);

    try {
      const schema = await loadCSVToDatabase(db, csvPath, tableName);
      if (schema) {
        schemas.push(schema);
      }
    } catch (error) {
      console.error(`Error loading ${tableName}:`, error);
    }
  }

  // Save schema
  fs.writeFileSync(SCHEMA_PATH, JSON.stringify(schemas, null, 2));
  console.log(`\n✓ Saved schema to ${SCHEMA_PATH}`);

  // Extract and combine PDF documentation
  console.log("\n📄 Extracting PDF documentation...");

  const pdfFiles = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".pdf"))
    .sort();

  let combinedDocs = "";

  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(DATA_DIR, pdfFile);
    console.log(`  Processing ${pdfFile}...`);

    try {
      const text = await extractPDFText(pdfPath);
      combinedDocs += `\n\n========== ${pdfFile} ==========\n\n`;
      combinedDocs += text;
    } catch (error) {
      console.error(`  ✗ Error processing ${pdfFile}:`, error);
    }
  }

  fs.writeFileSync(DOCS_PATH, combinedDocs);
  console.log(`✓ Saved documentation to ${DOCS_PATH}`);

  // Summary
  console.log("\n✅ Data loading complete!");
  console.log("\nSummary:");
  console.log("  - Database: Neon PostgreSQL");
  console.log(`  - Tables: ${schemas.length}`);
  console.log(
    `  - Total rows: ${schemas.reduce((sum, s) => sum + s.rowCount, 0)}`
  );
  console.log(`  - Documentation: ${combinedDocs.length} chars`);

  await connection.end();
}

main().catch(console.error);
