# Massachusetts Public Data Sources

This document provides links and instructions for obtaining publicly available data layers for the Massachusetts Afterschool Programs Map.

## Table of Contents
1. [Legislative Districts](#legislative-districts)
2. [EEC Regional Office Areas](#eec-regional-office-areas)
3. [Municipality Boundaries](#municipality-boundaries)
4. [Population Density](#population-density)
5. [Median Household Income](#median-household-income)
6. [Child Poverty Rates](#child-poverty-rates)
7. [Working Parent Households](#working-parent-households)
8. [School Districts](#school-districts)
9. [How to Use GeoJSON Data](#how-to-use-geojson-data)

---

## Legislative Districts

### Massachusetts House Districts
**Source**: MassGIS (Massachusetts Bureau of Geographic Information)
- **URL**: https://www.mass.gov/info-details/massgis-data-2022-massachusetts-house-and-senate-districts
- **Format**: Shapefile, GeoJSON
- **File**: `HOUSE_DISTRICTS_POLY.geojson`

### Massachusetts Senate Districts
**Source**: MassGIS
- **URL**: https://www.mass.gov/info-details/massgis-data-2022-massachusetts-house-and-senate-districts
- **Format**: Shapefile, GeoJSON
- **File**: `SENATE_DISTRICTS_POLY.geojson`

### Congressional Districts
**Source**: US Census Bureau
- **URL**: https://www.census.gov/cgi-bin/geo/shapefiles/index.php
- Select: Congressional Districts → Massachusetts
- **Format**: Shapefile (convert to GeoJSON)

**How to Download**:
1. Visit MassGIS Data Portal: https://www.mass.gov/orgs/massgis-bureau-of-geographic-information
2. Search for "Legislative Districts"
3. Download as GeoJSON or Shapefile
4. If Shapefile, convert using: https://mapshaper.org/

---

## EEC Regional Office Areas

**Source**: Department of Early Education and Care (EEC)
- **URL**: https://www.mass.gov/service-details/eec-regional-offices
- **Regional Offices**:
  - **Boston**: Suffolk, Norfolk, parts of Middlesex, Plymouth
  - **Central**: Worcester County
  - **Northeast**: Essex, northern Middlesex, Lowell area
  - **Southeast**: Bristol, Plymouth (southern), Cape Cod & Islands
  - **Western**: Berkshire, Franklin, Hampshire, Hampden

**Note**: EEC does not provide official GeoJSON boundaries. You will need to:
1. Create custom boundaries based on county groupings above
2. Or contact EEC directly for official service area boundaries
3. Use the provided `eec-regions-template.geojson` file and adjust as needed

**Creating Custom GeoJSON**:
- Use https://geojson.io/ to draw regions manually
- Or combine county boundaries from MassGIS based on the groupings above

---

## Municipality Boundaries

**Source**: MassGIS
- **URL**: https://www.mass.gov/info-details/massgis-data-municipalities
- **File**: `TOWNSSURVEY_POLYM.geojson`
- **Contains**: All 351 cities and towns in Massachusetts

**How to Download**:
1. Visit: https://www.mass.gov/info-details/massgis-data-municipalities
2. Click "Download this layer" → Choose GeoJSON format
3. Save as `municipalities.geojson` in `data/layers/` folder

**Attributes Include**:
- TOWN (town name)
- POP2020 (population from 2020 Census)
- FIPS_STCO (FIPS code)

---

## Population Density

**Source**: US Census Bureau - American Community Survey (ACS)
- **URL**: https://data.census.gov/
- **Table**: B01001 (Total Population)
- **Geography**: Census Tract or Block Group

**Alternative**: MassGIS with Census Data
- **URL**: https://www.mass.gov/info-details/massgis-data-census-2020
- **File**: `CENSUS2020BLOCKS_POLY.geojson` (with population)

**How to Get**:
1. Download Census tracts with population data
2. Calculate density = Population / Land Area (sq mi)
3. Join with GeoJSON geometry

**Quick Method**:
1. Use Census Reporter: https://censusreporter.org/
2. Search "Massachusetts"
3. Download population data by tract
4. Merge with tract boundaries from MassGIS

**Display**:
- Use choropleth map (color-coded by density)
- Ranges: 0-500, 500-2000, 2000-5000, 5000+, 10000+ per sq mi

---

## Median Household Income

**Source**: US Census Bureau - American Community Survey
- **URL**: https://data.census.gov/
- **Table**: S1901 (Income in the Past 12 Months)
- **Geography**: Census Tract or ZIP Code Tabulation Area (ZCTA)

**Alternative**: Social Explorer
- **URL**: https://www.socialexplorer.com/ (requires free account)
- More user-friendly interface
- Can export with GeoJSON

**How to Download**:
1. Go to https://data.census.gov/
2. Search: "S1901 median household income Massachusetts"
3. Select geography: Census Tract → Massachusetts → All tracts
4. Download CSV
5. Get tract boundaries from MassGIS
6. Join data to boundaries using GEOID

**MassGIS Census Tracts**:
- URL: https://www.mass.gov/info-details/massgis-data-census-2020-tiger-line-files
- File: `CENSUS2020TRACTS_POLY.geojson`

**Display Ranges**:
- Under $40,000
- $40,000 - $60,000
- $60,000 - $80,000
- $80,000 - $100,000
- $100,000 - $150,000
- Over $150,000

---

## Child Poverty Rates

**Source**: US Census Bureau - American Community Survey
- **URL**: https://data.census.gov/
- **Table**: S1701 (Poverty Status in the Past 12 Months)
- **Specific**: Percentage under 18 years in poverty
- **Geography**: Census Tract

**Alternative**: Kids Count Data Center
- **URL**: https://datacenter.kidscount.org/
- State: Massachusetts
- Indicator: "Children in Poverty"
- Available by county and sometimes by city/town

**How to Download**:
1. Visit https://data.census.gov/
2. Search: "S1701 poverty children Massachusetts"
3. Select: Census Tract → Massachusetts
4. Download: Table with estimates
5. Join to tract boundaries

**Display Ranges**:
- 0-5% (very low)
- 5-10% (low)
- 10-15% (moderate)
- 15-25% (high)
- 25%+ (very high)

**Note**: This data is critical for identifying areas with highest need for afterschool programs.

---

## Working Parent Households

**Source**: US Census Bureau - American Community Survey
- **URL**: https://data.census.gov/
- **Table**: B23008 (Age of Own Children Under 18 Years in Families and Subfamilies by Living Arrangements by Employment Status of Parents)
- **Geography**: Census Tract or County

**Simplified Alternative**:
- **Table**: S2301 (Employment Status - Labor Force Participation)
- Filter for households with children

**How to Download**:
1. Go to https://data.census.gov/
2. Search: "B23008 working parents Massachusetts"
3. Select geography: Census Tract → Massachusetts
4. Download CSV
5. Join to tract GeoJSON boundaries

**Calculate**:
- Working parent households = Households where at least one parent is employed
- Percentage = (Working parent households / Total households with children) × 100

**Display**:
- Choropleth showing percentage of households with working parents
- Higher percentages = higher need for afterschool care

---

## School Districts

**Source**: MassGIS
- **URL**: https://www.mass.gov/info-details/massgis-data-school-districts
- **File**: `SCHOOLDISTRICTS_POLY.geojson`

**Alternative**: National Center for Education Statistics (NCES)
- **URL**: https://nces.ed.gov/programs/edge/Geographic/DistrictBoundaries
- Select: Massachusetts
- Download school district boundaries

**How to Download from MassGIS**:
1. Visit: https://www.mass.gov/info-details/massgis-data-school-districts
2. Download GeoJSON format
3. Save as `school-districts.geojson`

**Attributes**:
- DISTRICT (district name)
- DISTRICT_ID
- GRADE_SPAN
- ENROLLMENT (student count)

**Student Population Data**:
- **Source**: MA Department of Elementary and Secondary Education (DESE)
- **URL**: https://profiles.doe.mass.edu/
- **Download**: District profiles with enrollment data
- Join enrollment numbers to district boundaries by DISTRICT_ID

---

## How to Use GeoJSON Data

### 1. Download and Convert Shapefiles

If data is only available as Shapefile:
1. Download the Shapefile (.shp, .dbf, .shx, .prj files)
2. Visit https://mapshaper.org/
3. Drag all files into the browser
4. Click "Export" → Choose "GeoJSON"
5. Save to your `data/layers/` folder

### 2. Integrate into the Map

Place downloaded GeoJSON files in: `/data/layers/`

```
mappingtool/
├── data/
│   ├── layers/
│   │   ├── municipalities.geojson
│   │   ├── legislative-districts.geojson
│   │   ├── school-districts.geojson
│   │   ├── census-tracts-income.geojson
│   │   ├── census-tracts-poverty.geojson
│   │   └── eec-regions.geojson
```

### 3. Update app.js

The application is configured to automatically load these layers from the `data/layers/` folder when the corresponding checkbox is toggled.

Example code structure (already in `app.js`):
```javascript
async function loadLegislativeLayer() {
    const response = await fetch('data/layers/legislative-districts.geojson');
    const data = await response.json();
    // Add to map with styling
}
```

### 4. Color Schemes for Choropleth Maps

**Population Density**:
- Use sequential color scheme: Light gray → Dark gray

**Income**:
- Low income: Red shades
- High income: Green shades

**Poverty**:
- Low poverty: Light yellow
- High poverty: Dark red

**Working Parents**:
- Low percentage: Light blue
- High percentage: Dark blue

---

## Quick Start Guide

### Minimum Required Data

To get started, download these essential datasets:

1. **Municipality Boundaries** (Required)
   - https://www.mass.gov/info-details/massgis-data-municipalities
   - Save as: `data/layers/municipalities.geojson`

2. **Census Tracts with Income Data** (Recommended)
   - https://data.census.gov/ → Search "S1901 Massachusetts"
   - Download boundaries: https://www.mass.gov/info-details/massgis-data-census-2020-tiger-line-files
   - Join income data to boundaries
   - Save as: `data/layers/census-tracts-income.geojson`

3. **School Districts** (Recommended)
   - https://www.mass.gov/info-details/massgis-data-school-districts
   - Save as: `data/layers/school-districts.geojson`

### Data Processing Tools

**Online Tools**:
- **Mapshaper**: https://mapshaper.org/ (convert/simplify GeoJSON)
- **GeoJSON.io**: https://geojson.io/ (view/edit/create)
- **Census Reporter**: https://censusreporter.org/ (easy Census data download)

**Desktop Tools** (Optional):
- **QGIS**: https://qgis.org/ (professional GIS software, free)
- **Python + GeoPandas**: For programmatic data processing

---

## Support Resources

### MassGIS Help
- **Email**: MassGIS@mass.gov
- **Documentation**: https://www.mass.gov/orgs/massgis-bureau-of-geographic-information

### Census Bureau Help
- **Support**: https://ask.census.gov/
- **Tutorials**: https://www.census.gov/data/training-workshops.html

### GeoJSON Specification
- **Format Guide**: https://geojson.org/
- **Validator**: https://geojsonlint.com/

---

## Legal / Attribution

When using public data, include proper attribution:

```
Data Sources:
- Municipality boundaries: MassGIS (Commonwealth of Massachusetts)
- Demographic data: U.S. Census Bureau, American Community Survey
- School districts: Massachusetts Department of Elementary and Secondary Education
- Map tiles: © OpenStreetMap contributors
```

---

## Updates and Maintenance

**Census Data**: Updated annually (American Community Survey)
- **Best Practice**: Refresh demographic data yearly

**Legislative Districts**: Updated after redistricting (every 10 years)
- **Last Update**: 2022
- **Next Update**: 2032

**Municipality Boundaries**: Rarely change
- **Check**: Annually for any annexations or changes

**School Districts**: Can change due to mergers/reorganizations
- **Check**: Annually via DESE

---

**Need Help?**

If you need assistance obtaining or processing any of this data:
1. Check MassGIS documentation first
2. Use Census Reporter for simplified Census data access
3. Contact the data source directly (contact info provided above)
4. Consider hiring a GIS consultant for complex data processing

All data sources listed are freely available to the public.
