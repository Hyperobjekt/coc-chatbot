#!/usr/bin/env tsx
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { PDFParse } from 'pdf-parse';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(process.cwd(), 'data.db');
const SCHEMA_PATH = path.join(process.cwd(), 'schema.json');
const DOCS_PATH = path.join(process.cwd(), 'documentation.txt');

interface TableSchema {
  name: string;
  columns: Array<{
    name: string;
    type: string;
  }>;
  rowCount: number;
}

// Infer SQLite type from value
function inferType(value: string): string {
  if (!value || value === '') return 'TEXT';
  
  // Check for integers
  if (/^\d+$/.test(value)) return 'INTEGER';
  
  // Check for floats
  if (/^\d+\.\d+$/.test(value)) return 'REAL';
  
  // Check for dates (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'TEXT'; // Store as text for easier queries
  
  return 'TEXT';
}

// Get most specific type from sample values
function getColumnType(values: string[]): string {
  const nonEmpty = values.filter(v => v && v !== '');
  if (nonEmpty.length === 0) return 'TEXT';
  
  const types = nonEmpty.slice(0, 100).map(inferType);
  
  if (types.every(t => t === 'INTEGER')) return 'INTEGER';
  if (types.every(t => t === 'INTEGER' || t === 'REAL')) return 'REAL';
  
  return 'TEXT';
}

async function loadCSVToDatabase(db: Database.Database, csvPath: string, tableName: string) {
  console.log(`Loading ${tableName}...`);
  
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
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
    const values = data.map(row => row[col] || '');
    columnTypes[col] = getColumnType(values);
  }
  
  // Create table
  const columnDefs = columns
    .map(col => `"${col}" ${columnTypes[col]}`)
    .join(', ');
  
  db.exec(`DROP TABLE IF EXISTS "${tableName}"`);
  db.exec(`CREATE TABLE "${tableName}" (${columnDefs})`);
  
  // Insert data
  const placeholders = columns.map(() => '?').join(', ');
  const columnNames = columns.map(c => `"${c}"`).join(', ');
  const insert = db.prepare(
    `INSERT INTO "${tableName}" (${columnNames}) VALUES (${placeholders})`
  );
  
  const insertMany = db.transaction((rows: Record<string, string>[]) => {
    for (const row of rows) {
      const values = columns.map(col => row[col] === '' ? null : row[col]);
      insert.run(...values);
    }
  });
  
  insertMany(data);
  
  console.log(`  ✓ Loaded ${data.length} rows`);
  
  return {
    name: tableName,
    columns: columns.map(name => ({
      name,
      type: columnTypes[name]
    })),
    rowCount: data.length
  };
}

async function extractPDFText(pdfPath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

async function main() {
  console.log('🚀 Starting data loading...\n');
  
  // Initialize database
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log('Removed existing database\n');
  }
  
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  
  // Load all CSVs
  const csvFiles = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.csv'))
    .sort();
  
  const schemas: TableSchema[] = [];
  
  for (const csvFile of csvFiles) {
    const tableName = csvFile.replace('.csv', '');
    const csvPath = path.join(DATA_DIR, csvFile);
    
    const schema = await loadCSVToDatabase(db, csvPath, tableName);
    if (schema) {
      schemas.push(schema);
    }
  }
  
  // Save schema
  fs.writeFileSync(SCHEMA_PATH, JSON.stringify(schemas, null, 2));
  console.log(`\n✓ Saved schema to ${SCHEMA_PATH}`);
  
  // Extract and combine PDF documentation
  console.log('\n📄 Extracting PDF documentation...');
  
  const pdfFiles = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.pdf'))
    .sort();
  
  let combinedDocs = '';
  
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
  console.log('\n✅ Data loading complete!');
  console.log(`\nSummary:`);
  console.log(`  - Database: ${DB_PATH}`);
  console.log(`  - Tables: ${schemas.length}`);
  console.log(`  - Total rows: ${schemas.reduce((sum, s) => sum + s.rowCount, 0)}`);
  console.log(`  - Documentation: ${combinedDocs.length} chars`);
  
  db.close();
}

main().catch(console.error);
