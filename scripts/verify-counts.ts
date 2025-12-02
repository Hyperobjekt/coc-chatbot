#!/usr/bin/env tsx
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from '../lib/db/schema';

config({
  path: ".env.local",
});

async function main() {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  const connection = postgres(process.env.POSTGRES_URL);
  const db = drizzle(connection);

  const tables = [
    'Organization',
    'Project',
    'Client',
    'Enrollment',
    'Assessment',
    'Event',
    'Exit',
    'Services',
    'HealthAndDV',
    'IncomeBenefits',
    'EmploymentEducation',
    'CurrentLivingSituation',
    'ProjectCoC',
    'Inventory',
    'HMISParticipation',
    'Funder',
    'HMIS_User'
  ];

  console.log('Table Counts:');
  console.log('-'.repeat(40));
  console.log('Table Name'.padEnd(30) + 'Count');
  console.log('-'.repeat(40));

  for (const tableName of tables) {
    const result = await connection.unsafe(`SELECT COUNT(*) as count FROM "${tableName}"`);
    console.log(tableName.padEnd(30) + result[0].count);
  }

  console.log('-'.repeat(40));
  await connection.end();
}

main().catch(console.error);
