# Data Format Guide

This document describes the data format for uploading afterschool program information to the Massachusetts Afterschool Programs Map.

## Supported Formats

The application supports two data formats:
1. **JSON** (.json files)
2. **CSV** (.csv files)

## Required Fields

Each program record must include the following fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | Number/String | Unique identifier for the program | 1 |
| name | String | Program name | "Boston Youth Center" |
| address | String | Street address | "123 Main St" |
| city | String | City name | "Boston" |
| county | String | County name | "Suffolk" |
| region | String | Region (see regions below) | "Northeast" |
| zip | String | ZIP code | "02101" |
| lat | Number | Latitude coordinate | 42.3601 |
| lng | Number | Longitude coordinate | -71.0589 |
| phone | String | Contact phone number | "(617) 555-0100" |
| email | String | Contact email | "info@example.org" |
| website | String | Program website | "www.example.org" |
| services | String | Services offered (comma-separated) | "Homework help, Sports, Arts" |
| ageRange | String | Age range served | "6-14" |
| capacity | Number | Maximum capacity | 50 |

## Massachusetts Regions

Use one of the following region values:
- **Western** - Western Massachusetts
- **Central** - Central Massachusetts
- **Northeast** - Northeast Massachusetts
- **Southeast** - Southeast Massachusetts
- **Cape** - Cape Cod & Islands

## Massachusetts Counties

Valid county names:
- Barnstable
- Berkshire
- Bristol
- Dukes
- Essex
- Franklin
- Hampden
- Hampshire
- Middlesex
- Nantucket
- Norfolk
- Plymouth
- Suffolk
- Worcester

## JSON Format Example

```json
[
  {
    "id": 1,
    "name": "Boston Youth Center",
    "address": "123 Main St",
    "city": "Boston",
    "county": "Suffolk",
    "region": "Northeast",
    "zip": "02101",
    "lat": 42.3601,
    "lng": -71.0589,
    "phone": "(617) 555-0100",
    "email": "info@bostonyouth.org",
    "website": "www.bostonyouth.org",
    "services": "Homework help, Sports, Arts",
    "ageRange": "6-14",
    "capacity": 50
  }
]
```

## CSV Format Example

```csv
id,name,address,city,county,region,zip,lat,lng,phone,email,website,services,ageRange,capacity
1,Boston Youth Center,123 Main St,Boston,Suffolk,Northeast,02101,42.3601,-71.0589,(617) 555-0100,info@bostonyouth.org,www.bostonyouth.org,"Homework help, Sports, Arts",6-14,50
```

## Getting Coordinates

To find latitude and longitude coordinates for an address:
1. Visit [Google Maps](https://maps.google.com)
2. Search for the address
3. Right-click on the location marker
4. Select "What's here?"
5. Copy the coordinates (first number is latitude, second is longitude)

Alternatively, you can use geocoding services to batch convert addresses to coordinates.

## Tips

- Ensure all required fields are present for each program
- Double-check latitude and longitude values (latitude should be ~42, longitude should be ~-71 for Massachusetts)
- Use consistent formatting for phone numbers and ZIP codes
- Keep service descriptions concise but informative
- Verify county and region assignments match the program location
