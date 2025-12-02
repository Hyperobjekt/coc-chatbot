# HMIS Lookup Tables & Code Mappings

## Overview
This document provides comprehensive mappings for all coded values in the HMIS database. These codes are used across multiple tables to standardize data entry and reporting.

## Project Information Codes

### Project Type Codes
| Code | Description |
|------|-------------|
| 0 | Emergency Shelter - Entry Exit |
| 1 | Emergency Shelter - Night-by-Night |
| 2 | Transitional Housing |
| 3 | PH - Permanent Supportive Housing |
| 4 | Street Outreach |
| 6 | Services Only |
| 8 | Safe Haven |
| 13 | PH - Rapid Re-Housing |
| 14 | Coordinated Entry |

### Housing Type
| Code | Description |
|------|-------------|
| 1 | Site-based - single site |
| 2 | Site-based - clustered/multiple sites |
| 3 | Tenant-based - scattered site |

### Target Population
| Code | Description |
|------|-------------|
| 1 | DV: Survivors of Domestic Violence |
| 3 | HIV: Persons with HIV/AIDS |
| 4 | NA: Not applicable |

## Client Demographics

### Name Data Quality
| Code | Description |
|------|-------------|
| 1 | Full name reported |
| 2 | Partial, street name, or code name |
| 8 | Client doesn't know |
| 9 | Client prefers not to answer |
| 99 | Data not collected |

### SSN Data Quality
| Code | Description |
|------|-------------|
| 1 | Full SSN reported |
| 2 | Approximate or partial SSN |
| 8 | Client doesn't know |
| 9 | Client prefers not to answer |
| 99 | Data not collected |

### Military Branch
| Code | Description |
|------|-------------|
| 1 | Army |
| 2 | Air Force |
| 3 | Navy |
| 4 | Marines |
| 5 | Coast Guard |
| 6 | Space Force |
| 8 | Client doesn't know |
| 9 | Client prefers not to answer |
| 99 | Data not collected |

### Discharge Status
| Code | Description |
|------|-------------|
| 1 | Honorable |
| 2 | General under honorable conditions |
| 4 | Bad conduct |
| 5 | Dishonorable |
| 6 | Under other than honorable conditions (OTH) |
| 7 | Uncharacterized |
| 8 | Client doesn't know |
| 9 | Client prefers not to answer |
| 99 | Data not collected |

## Living Situation & Destination Codes

### Homeless Situations (100-199)
| Code | Description |
|------|-------------|
| 116 | Place not meant for habitation |
| 101 | Emergency shelter/hotel/motel with voucher |
| 118 | Safe Haven |

### Institutional Settings (200-299)
| Code | Description |
|------|-------------|
| 201 | Foster care |
| 202 | Hospital (non-psychiatric) |
| 203 | Jail/prison |
| 204 | Long-term care |
| 205 | Psychiatric facility |
| 206 | Substance abuse facility |

### Temporary Housing (300-399)
| Code | Description |
|------|-------------|
| 302 | Transitional housing |
| 303 | Residential project (no homeless criteria) |
| 304 | Hotel/motel without voucher |
| 305 | Staying with family (temporary) |
| 306 | Staying with friends (temporary) |

### Permanent Housing (400-499)
| Code | Description |
|------|-------------|
| 401 | Staying with family (permanent) |
| 402 | Staying with friends (permanent) |
| 410 | Rental without subsidy |
| 411 | Rental with subsidy |
| 421 | Owned without subsidy |
| 422 | Owned with subsidy |

### Length of Stay
| Code | Description |
|------|-------------|
| 2 | One week or more, but less than one month |
| 3 | One month or more, but less than 90 days |
| 4 | 90 days or more, but less than one year |
| 5 | One year or longer |
| 8 | Client doesn't know |
| 9 | Client prefers not to answer |
| 99 | Data not collected |

## Health & Disability

### General/Dental/Mental Health Status
| Code | Description |
|------|-------------|
| 1 | Excellent |
| 2 | Very Good |
| 3 | Good |
| 4 | Fair |
| 5 | Poor |
| 8 | Client doesn't know |
| 9 | Client prefers not to answer |
| 99 | Data not collected |

### Disability Types
| Code | Description |
|------|-------------|
| 0 | No |
| 1 | Yes |
| 8 | Client doesn't know |
| 9 | Client prefers not to answer |
| 99 | Data not collected |

## Income & Benefits

### Income Source Types
| Code | Description |
|------|-------------|
| 1 | Earned Income |
| 2 | Unemployment Insurance |
| 3 | Supplemental Security Income (SSI) |
| 4 | Social Security Disability Income (SSDI) |
| 5 | VA Service-Connected Disability Compensation |
| 6 | VA Non-Service-Connected Disability Pension |
| 7 | Private Disability Insurance |
| 8 | Worker's Compensation |
| 9 | TANF |
| 10 | General Assistance |
| 11 | Retirement (Social Security) |
| 12 | Pension from Former Job |
| 13 | Child Support |
| 14 | Alimony |
| 15 | Other Income Source |

### Non-Cash Benefits
| Code | Description |
|------|-------------|
| 1 | SNAP (Food Stamps) |
| 2 | WIC |
| 3 | TANF Child Care Services |
| 4 | TANF Transportation Services |
| 5 | Other TANF-Funded Services |
| 6 | Other Source |

## Common Yes/No/Missing Codes
These codes are used consistently across many fields:

| Code | Description |
|------|-------------|
| 0 | No |
| 1 | Yes |
| 8 | Client doesn't know |
| 9 | Client prefers not to answer |
| 99 | Data not collected |

## Usage Notes

1. Always check for "DateDeleted IS NULL" when querying any table
2. Use appropriate type casting for dates (stored as text)
3. Join through Enrollment table to connect clients and services
4. Include appropriate indexes on lookup columns
5. Consider data quality (8, 9, 99) when analyzing results
