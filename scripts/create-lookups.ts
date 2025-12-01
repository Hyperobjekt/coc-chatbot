import Database from 'better-sqlite3';

const db = new Database('data.db');

// Create lookup tables
db.exec(`
-- Living Situation Lookup
CREATE TABLE IF NOT EXISTS LivingSituationLookup (
    Code INTEGER PRIMARY KEY,
    Category TEXT,
    Description TEXT
);

-- Project Type Lookup
CREATE TABLE IF NOT EXISTS ProjectTypeLookup (
    Code INTEGER PRIMARY KEY,
    Description TEXT
);

-- Destination Lookup  
CREATE TABLE IF NOT EXISTS DestinationLookup (
    Code INTEGER PRIMARY KEY,
    Category TEXT,
    Description TEXT
);

-- Housing Status Lookup
CREATE TABLE IF NOT EXISTS HousingStatusLookup (
    Code INTEGER PRIMARY KEY,
    Description TEXT
);
`);

// Insert living situation lookup data
const livingSituations = [
    // Homeless Situations (100-199)
    [116, 'Homeless', 'Place not meant for habitation'],
    [101, 'Homeless', 'Emergency shelter, including hotel/motel paid with voucher'],
    [118, 'Homeless', 'Safe Haven'],
    
    // Institutional Situations (200-299)
    [201, 'Institutional', 'Foster care home or group home'],
    [202, 'Institutional', 'Hospital or non-psychiatric medical facility'],
    [203, 'Institutional', 'Jail, prison or juvenile detention'],
    [204, 'Institutional', 'Long-term care facility or nursing home'],
    [205, 'Institutional', 'Psychiatric hospital or facility'],
    [206, 'Institutional', 'Substance abuse treatment facility'],
    
    // Temporary Housing (300-399)
    [302, 'Temporary', 'Transitional housing'],
    [303, 'Temporary', 'Residential project with no homeless criteria'],
    [304, 'Temporary', 'Hotel/motel paid without voucher'],
    [305, 'Temporary', 'Staying with family, temporary'],
    [306, 'Temporary', 'Staying with friends, temporary'],
    
    // Permanent Housing (400-499)
    [401, 'Permanent', 'Staying with family, permanent'],
    [402, 'Permanent', 'Staying with friends, permanent'],
    [410, 'Permanent', 'Rental by client, no subsidy'],
    [411, 'Permanent', 'Rental by client, with subsidy'],
    [421, 'Permanent', 'Owned by client, no subsidy'],
    [422, 'Permanent', 'Owned by client, with subsidy']
];

const insertLivingSituation = db.prepare(`
    INSERT INTO LivingSituationLookup (Code, Category, Description)
    VALUES (?, ?, ?)
`);

for (const situation of livingSituations) {
    insertLivingSituation.run(situation);
}

// Insert project type lookup data
const projectTypes = [
    [0, 'Emergency Shelter - Entry Exit'],
    [1, 'Emergency Shelter - Night-by-Night'],
    [2, 'Transitional Housing'],
    [3, 'PH - Permanent Supportive Housing'],
    [4, 'Street Outreach'],
    [6, 'Services Only'],
    [7, 'Other'],
    [8, 'Safe Haven'],
    [9, 'PH - Housing Only'],
    [10, 'PH - Housing with Services'],
    [11, 'Day Shelter'],
    [12, 'Homelessness Prevention'],
    [13, 'PH - Rapid Re-Housing'],
    [14, 'Coordinated Entry']
];

const insertProjectType = db.prepare(`
    INSERT INTO ProjectTypeLookup (Code, Description)
    VALUES (?, ?)
`);

for (const type of projectTypes) {
    insertProjectType.run(type);
}

// Insert destination lookup data
const destinations = [
    // Homeless Situations
    [116, 'Homeless', 'Place not meant for habitation'],
    [101, 'Homeless', 'Emergency shelter'],
    [118, 'Homeless', 'Safe Haven'],
    
    // Institutional Settings  
    [204, 'Institutional', 'Psychiatric hospital'],
    [205, 'Institutional', 'Substance abuse facility'],
    [206, 'Institutional', 'Hospital'],
    [207, 'Institutional', 'Jail/prison'],
    
    // Temporary Settings
    [302, 'Temporary', 'Transitional housing'],
    [303, 'Temporary', 'Residential program'],
    [304, 'Temporary', 'Hotel/motel no voucher'],
    [305, 'Temporary', 'Family temporary'],
    [306, 'Temporary', 'Friends temporary'],
    
    // Permanent Settings  
    [401, 'Permanent', 'Family permanent'],
    [402, 'Permanent', 'Friends permanent'],
    [410, 'Permanent', 'Rental no subsidy'],
    [411, 'Permanent', 'Rental with subsidy'],
    [421, 'Permanent', 'Owned by client'],
    [422, 'Permanent', 'Owned with subsidy']
];

const insertDestination = db.prepare(`
    INSERT INTO DestinationLookup (Code, Category, Description) 
    VALUES (?, ?, ?)
`);

for (const dest of destinations) {
    insertDestination.run(dest);
}

// Insert housing status lookup data
const housingStatuses = [
    [1, 'Category 1 - Literally Homeless'],
    [2, 'Category 2 - Imminent Risk of Homelessness'],
    [3, 'Category 3 - Homeless under other Federal statutes'],
    [4, 'Category 4 - Fleeing domestic violence'],
    [5, 'At-risk of homelessness'],
    [6, 'Stably housed']
];

const insertHousingStatus = db.prepare(`
    INSERT INTO HousingStatusLookup (Code, Description)
    VALUES (?, ?)
`);

for (const status of housingStatuses) {
    insertHousingStatus.run(status);
}

console.log('Lookup tables created and populated successfully');
