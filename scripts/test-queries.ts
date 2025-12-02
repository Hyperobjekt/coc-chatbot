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

  console.log('Running test queries...\n');

  // Test 1: Join Organization -> Project
  console.log('Test 1: Organizations and their Projects');
  console.log('-'.repeat(80));
  const orgProjects = await connection.unsafe(`
    SELECT o."OrganizationName", COUNT(p."ProjectID") as project_count
    FROM "Organization" o
    LEFT JOIN "Project" p ON o."OrganizationID" = p."OrganizationID"
    GROUP BY o."OrganizationID", o."OrganizationName"
    ORDER BY project_count DESC
    LIMIT 5
  `);
  console.log('Top 5 Organizations by Project Count:');
  orgProjects.forEach(row => {
    console.log(`${row.OrganizationName?.padEnd(50)} ${row.project_count} projects`);
  });
  console.log();

  // Test 2: Project -> Enrollment -> Client relationship
  console.log('Test 2: Projects and their Client Enrollments');
  console.log('-'.repeat(80));
  const projectEnrollments = await connection.unsafe(`
    SELECT p."ProjectName", 
           COUNT(DISTINCT e."EnrollmentID") as enrollment_count,
           COUNT(DISTINCT e."PersonalID") as unique_clients
    FROM "Project" p
    LEFT JOIN "Enrollment" e ON p."ProjectID" = e."ProjectID"
    GROUP BY p."ProjectID", p."ProjectName"
    ORDER BY enrollment_count DESC
    LIMIT 5
  `);
  console.log('Top 5 Projects by Enrollment Count:');
  projectEnrollments.forEach(row => {
    console.log(`${row.ProjectName?.padEnd(50)} ${row.enrollment_count} enrollments (${row.unique_clients} unique clients)`);
  });
  console.log();

  // Test 3: Services provided to clients
  console.log('Test 3: Service Types Overview');
  console.log('-'.repeat(80));
  const services = await connection.unsafe(`
    SELECT s."TypeProvided",
           COUNT(*) as service_count,
           COUNT(DISTINCT s."PersonalID") as unique_clients
    FROM "Services" s
    GROUP BY s."TypeProvided"
    ORDER BY service_count DESC
    LIMIT 5
  `);
  console.log('Top 5 Service Types:');
  services.forEach(row => {
    console.log(`Type ${row.TypeProvided?.toString().padEnd(46)} ${row.service_count} services (${row.unique_clients} unique clients)`);
  });

  await connection.end();
}

main().catch(console.error);
