#!/usr/bin/env tsx
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from '../lib/db/schema';

config({
  path: ".env.local",
});

async function verifyLookupTables() {
  console.log('🔍 Verifying lookup tables...\n');
  
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }
  
  // Initialize database connection
  const connection = postgres(process.env.POSTGRES_URL);
  const db = drizzle(connection);

  try {
    // Check LivingSituationLookup
    const livingSituations = await db.select().from(schema.livingSituationLookup);
    console.log('Living Situations:', livingSituations.length, 'records');
    if (livingSituations.length === 0) {
      console.error('❌ LivingSituationLookup is empty!');
    } else {
      console.log('✓ Sample entries:');
      console.log(livingSituations.slice(0, 3));
    }

    // Check ProjectTypeLookup
    const projectTypes = await db.select().from(schema.projectTypeLookup);
    console.log('\nProject Types:', projectTypes.length, 'records');
    if (projectTypes.length === 0) {
      console.error('❌ ProjectTypeLookup is empty!');
    } else {
      console.log('✓ Sample entries:');
      console.log(projectTypes.slice(0, 3));
    }

    // Check DestinationLookup
    const destinations = await db.select().from(schema.destinationLookup);
    console.log('\nDestinations:', destinations.length, 'records');
    if (destinations.length === 0) {
      console.error('❌ DestinationLookup is empty!');
    } else {
      console.log('✓ Sample entries:');
      console.log(destinations.slice(0, 3));
    }

    // Check HousingStatusLookup
    const housingStatuses = await db.select().from(schema.housingStatusLookup);
    console.log('\nHousing Statuses:', housingStatuses.length, 'records');
    if (housingStatuses.length === 0) {
      console.error('❌ HousingStatusLookup is empty!');
    } else {
      console.log('✓ Sample entries:');
      console.log(housingStatuses.slice(0, 3));
    }

    // Verify foreign key relationships
    console.log('\nVerifying foreign key relationships...');

    // Check Project -> ProjectTypeLookup
    const projectsWithInvalidType = await db
      .select()
      .from(schema.project)
      .where(sql`${schema.project.ProjectType} IS NOT NULL AND ${schema.project.ProjectType} NOT IN (SELECT ${schema.projectTypeLookup.Code} FROM ${schema.projectTypeLookup})`);
    
    if (projectsWithInvalidType.length > 0) {
      console.error(`❌ Found ${projectsWithInvalidType.length} projects with invalid ProjectType!`);
      console.log('Sample invalid projects:', projectsWithInvalidType.slice(0, 3));
    } else {
      console.log('✓ All project types are valid');
    }

    // Check Enrollment -> LivingSituationLookup
    const enrollmentsWithInvalidSituation = await db
      .select()
      .from(schema.enrollment)
      .where(sql`${schema.enrollment.LivingSituation} IS NOT NULL AND ${schema.enrollment.LivingSituation} NOT IN (SELECT ${schema.livingSituationLookup.Code} FROM ${schema.livingSituationLookup})`);
    
    if (enrollmentsWithInvalidSituation.length > 0) {
      console.error(`❌ Found ${enrollmentsWithInvalidSituation.length} enrollments with invalid LivingSituation!`);
      console.log('Sample invalid enrollments:', enrollmentsWithInvalidSituation.slice(0, 3));
    } else {
      console.log('✓ All living situations are valid');
    }

    // Check Exit -> DestinationLookup
    const exitsWithInvalidDestination = await db
      .select()
      .from(schema.exit)
      .where(sql`${schema.exit.Destination} IS NOT NULL AND ${schema.exit.Destination} NOT IN (SELECT ${schema.destinationLookup.Code} FROM ${schema.destinationLookup})`);
    
    if (exitsWithInvalidDestination.length > 0) {
      console.error(`❌ Found ${exitsWithInvalidDestination.length} exits with invalid Destination!`);
      console.log('Sample invalid exits:', exitsWithInvalidDestination.slice(0, 3));
    } else {
      console.log('✓ All destinations are valid');
    }

  } catch (error) {
    console.error('Error verifying lookup tables:', error);
  } finally {
    await connection.end();
  }
}

verifyLookupTables().catch(console.error);
