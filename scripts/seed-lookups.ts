import { db } from '../lib/db';
import { livingSituationLookup, projectTypeLookup, destinationLookup, housingStatusLookup } from '../lib/db/schema';

async function seedLookups() {
  // Living Situation Lookup
  const livingSituations = [
    {
      Code: 116,
      Category: "Homeless Situations",
      Description: "Place not meant for habitation (e.g., a vehicle, an abandoned building, bus/train/subway station/airport or anywhere outside)"
    },
    {
      Code: 101,
      Category: "Homeless Situations", 
      Description: "Emergency shelter, including hotel or motel paid for with emergency shelter voucher, Host Home shelter"
    },
    {
      Code: 118,
      Category: "Homeless Situations",
      Description: "Safe Haven"
    },
    {
      Code: 215,
      Category: "Institutional Situations",
      Description: "Foster care home or foster care group home"
    },
    {
      Code: 204,
      Category: "Institutional Situations", 
      Description: "Hospital or other residential non-psychiatric medical facility"
    },
    {
      Code: 205,
      Category: "Institutional Situations",
      Description: "Jail, prison, or juvenile detention facility"
    },
    {
      Code: 206,
      Category: "Institutional Situations",
      Description: "Long-term care facility or nursing home"
    },
    {
      Code: 207,
      Category: "Institutional Situations",
      Description: "Psychiatric hospital or other psychiatric facility"
    },
    {
      Code: 208,
      Category: "Institutional Situations",
      Description: "Substance abuse treatment facility or detox center"
    },
    {
      Code: 302,
      Category: "Temporary Housing Situations",
      Description: "Transitional housing for homeless persons (including homeless youth)"
    },
    {
      Code: 303,
      Category: "Temporary Housing Situations",
      Description: "Residential project or halfway house with no homeless criteria"
    },
    {
      Code: 304,
      Category: "Temporary Housing Situations",
      Description: "Hotel or motel paid for without emergency shelter voucher"
    },
    {
      Code: 305,
      Category: "Temporary Housing Situations",
      Description: "Host Home (non-crisis)"
    },
    {
      Code: 306,
      Category: "Temporary Housing Situations",
      Description: "Staying or living with family, temporary tenure"
    },
    {
      Code: 307,
      Category: "Temporary Housing Situations",
      Description: "Staying or living with friends, temporary tenure"
    },
    {
      Code: 308,
      Category: "Temporary Housing Situations",
      Description: "Moved from one HOPWA funded project to HOPWA TH"
    },
    {
      Code: 309,
      Category: "Temporary Housing Situations",
      Description: "Staying or living in a friend's room, apartment, or house"
    },
    {
      Code: 310,
      Category: "Temporary Housing Situations",
      Description: "Staying or living in a family member's room, apartment, or house"
    },
    {
      Code: 401,
      Category: "Permanent Housing Situations",
      Description: "Staying or living with family, permanent tenure"
    },
    {
      Code: 402,
      Category: "Permanent Housing Situations",
      Description: "Staying or living with friends, permanent tenure"
    },
    {
      Code: 403,
      Category: "Permanent Housing Situations",
      Description: "Moved from one HOPWA funded project to HOPWA PH"
    },
    {
      Code: 434,
      Category: "Permanent Housing Situations",
      Description: "Rental by client, no ongoing housing subsidy"
    },
    {
      Code: 435,
      Category: "Permanent Housing Situations",
      Description: "Rental by client, with ongoing housing subsidy"
    },
    {
      Code: 436,
      Category: "Permanent Housing Situations",
      Description: "Owned by client, with ongoing housing subsidy"
    },
    {
      Code: 437,
      Category: "Permanent Housing Situations",
      Description: "Owned by client, no ongoing housing subsidy"
    }
  ];

  // Project Type Lookup
  const projectTypes = [
    {
      Code: 0,
      Description: "Emergency Shelter - Entry Exit"
    },
    {
      Code: 1,
      Description: "Emergency Shelter - Night-by-Night"
    },
    {
      Code: 2,
      Description: "Transitional Housing"
    },
    {
      Code: 3,
      Description: "PH - Permanent Supportive Housing"
    },
    {
      Code: 4,
      Description: "Street Outreach"
    },
    {
      Code: 6,
      Description: "Services Only"
    },
    {
      Code: 7,
      Description: "Other"
    },
    {
      Code: 8,
      Description: "Safe Haven"
    },
    {
      Code: 9,
      Description: "PH - Housing Only"
    },
    {
      Code: 10,
      Description: "PH - Housing with Services"
    },
    {
      Code: 11,
      Description: "Day Shelter"
    },
    {
      Code: 12,
      Description: "Homelessness Prevention"
    },
    {
      Code: 13,
      Description: "PH - Rapid Re-Housing"
    },
    {
      Code: 14,
      Description: "Coordinated Entry"
    }
  ];

  // Destination Lookup (using same codes as Living Situation where applicable)
  const destinations = [
    {
      Code: 116,
      Category: "Homeless Situations",
      Description: "Place not meant for habitation"
    },
    {
      Code: 101,
      Category: "Homeless Situations",
      Description: "Emergency shelter, including hotel or motel paid for with emergency shelter voucher, Host Home shelter"
    },
    {
      Code: 118,
      Category: "Homeless Situations",
      Description: "Safe Haven"
    },
    {
      Code: 215,
      Category: "Institutional Situations",
      Description: "Foster care home or foster care group home"
    },
    {
      Code: 204,
      Category: "Institutional Situations",
      Description: "Hospital or other residential non-psychiatric medical facility"
    },
    {
      Code: 205,
      Category: "Institutional Situations",
      Description: "Jail, prison, or juvenile detention facility"
    },
    {
      Code: 206,
      Category: "Institutional Situations",
      Description: "Long-term care facility or nursing home"
    },
    {
      Code: 207,
      Category: "Institutional Situations",
      Description: "Psychiatric hospital or other psychiatric facility"
    },
    {
      Code: 208,
      Category: "Institutional Situations",
      Description: "Substance abuse treatment facility or detox center"
    },
    {
      Code: 302,
      Category: "Temporary Housing Situations",
      Description: "Transitional housing for homeless persons"
    },
    {
      Code: 303,
      Category: "Temporary Housing Situations",
      Description: "Residential project or halfway house with no homeless criteria"
    },
    {
      Code: 304,
      Category: "Temporary Housing Situations",
      Description: "Hotel or motel paid for without emergency shelter voucher"
    },
    {
      Code: 305,
      Category: "Temporary Housing Situations",
      Description: "Host Home (non-crisis)"
    },
    {
      Code: 306,
      Category: "Temporary Housing Situations",
      Description: "Staying or living with family, temporary tenure"
    },
    {
      Code: 307,
      Category: "Temporary Housing Situations",
      Description: "Staying or living with friends, temporary tenure"
    },
    {
      Code: 308,
      Category: "Temporary Housing Situations",
      Description: "Moved from one HOPWA funded project to HOPWA TH"
    },
    {
      Code: 401,
      Category: "Permanent Housing Situations",
      Description: "Staying or living with family, permanent tenure"
    },
    {
      Code: 402,
      Category: "Permanent Housing Situations",
      Description: "Staying or living with friends, permanent tenure"
    },
    {
      Code: 403,
      Category: "Permanent Housing Situations",
      Description: "Moved from one HOPWA funded project to HOPWA PH"
    },
    {
      Code: 434,
      Category: "Permanent Housing Situations",
      Description: "Rental by client, no ongoing housing subsidy"
    },
    {
      Code: 435,
      Category: "Permanent Housing Situations",
      Description: "Rental by client, with ongoing housing subsidy"
    },
    {
      Code: 436,
      Category: "Permanent Housing Situations",
      Description: "Owned by client, with ongoing housing subsidy"
    },
    {
      Code: 437,
      Category: "Permanent Housing Situations",
      Description: "Owned by client, no ongoing housing subsidy"
    },
    {
      Code: 24,
      Category: "Other",
      Description: "Deceased"
    }
  ];

  // Housing Status Lookup
  const housingStatuses = [
    {
      Code: 1,
      Description: "Category 1 - Literally Homeless"
    },
    {
      Code: 2,
      Description: "Category 2 - Imminent Risk of Homelessness"
    },
    {
      Code: 3,
      Description: "Category 3 - Homeless under other Federal statutes"
    },
    {
      Code: 4,
      Description: "Category 4 - Fleeing domestic violence"
    },
    {
      Code: 5,
      Description: "At-risk of homelessness"
    },
    {
      Code: 6,
      Description: "Stably housed"
    }
  ];

  try {
    // Clear existing data
    await db.delete(livingSituationLookup);
    await db.delete(projectTypeLookup);
    await db.delete(destinationLookup);
    await db.delete(housingStatusLookup);

    // Insert new data
    for (const situation of livingSituations) {
      await db.insert(livingSituationLookup).values(situation);
    }

    for (const projectType of projectTypes) {
      await db.insert(projectTypeLookup).values(projectType);
    }

    for (const destination of destinations) {
      await db.insert(destinationLookup).values(destination);
    }

    for (const status of housingStatuses) {
      await db.insert(housingStatusLookup).values(status);
    }

    console.log('Successfully seeded lookup tables');
  } catch (error) {
    console.error('Error seeding lookup tables:', error);
  }
}

seedLookups();
