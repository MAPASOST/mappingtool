# Data Layers Status

This document describes the current status of each data layer in this application.

## ✅ Production-Ready Layers (Real Data)

### 1. municipalities.geojson (18 MB)
- **Status**: ✅ Real data from official source
- **Source**: GitHub - nblmc/massachusetts-municipal-boundaries
- **Coverage**: All 351 Massachusetts cities and towns
- **Quality**: High - official boundary data
- **Properties**: TOWN (name), POP2020 (population), FIPS_STCO (FIPS code)
- **Last Updated**: Downloaded from most recent GitHub commit

### 2. legislative-districts.geojson (950 KB)
- **Status**: ✅ Real data from official source
- **Source**: GitHub - bhrutledge/ma-legislature
- **Coverage**: 160 House districts + 40 Senate districts (200 total)
- **Quality**: High - derived from MassGIS shapefiles
- **Properties**: district name, chamber (House/Senate), legislator info
- **Note**: Boundaries simplified to reduce file size
- **Last Updated**: 2022 redistricting cycle

### 3. eec-regions.geojson (3.4 KB)
- **Status**: ✅ Custom-created from official EEC office descriptions
- **Source**: Mass.gov EEC Regional Offices documentation
- **Coverage**: 5 EEC regional office service areas
- **Quality**: Good - approximate boundaries based on county groupings
- **Properties**: name, region_id, counties served, description
- **Note**: These are approximate boundaries. For exact service areas, contact EEC directly.

## 📊 Sample/Demonstration Layers (Limited Coverage)

The following layers contain **sample data for 6 major Massachusetts cities** (Boston, Worcester, Springfield, Cambridge, Lowell, New Bedford). These are provided for demonstration purposes to show how the layers work.

### 4. population-density.geojson (4.2 KB)
- **Status**: ⚠️ Sample data only
- **Coverage**: 6 cities (demonstration)
- **Properties**: name, density (people per sq mi), population, area_sqmi
- **To Replace**: Download census tract boundaries from MassGIS and join with Census Bureau population data
- **Instructions**: See DATA_SOURCES.md

### 5. median-income.geojson (4.2 KB)
- **Status**: ⚠️ Sample data only
- **Coverage**: 6 cities (demonstration)
- **Properties**: name, median_income, tract_id
- **To Replace**: Download census tracts and join with ACS Table S1901 (Median Household Income)
- **Instructions**: See DATA_SOURCES.md

### 6. child-poverty.geojson (4.3 KB)
- **Status**: ⚠️ Sample data only
- **Coverage**: 6 cities (demonstration)
- **Properties**: name, poverty_rate, children_total, children_poverty
- **To Replace**: Download census tracts and join with ACS Table S1701 (Poverty Status)
- **Instructions**: See DATA_SOURCES.md

### 7. working-parents.geojson (4.4 KB)
- **Status**: ⚠️ Sample data only
- **Coverage**: 6 cities (demonstration)
- **Properties**: name, working_parent_pct, total_households, working_parent_households
- **To Replace**: Download census tracts and join with ACS Table B23008 (Employment Status of Parents)
- **Instructions**: See DATA_SOURCES.md

### 8. school-districts.geojson (4.4 KB)
- **Status**: ⚠️ Sample data only
- **Coverage**: 6 cities (demonstration)
- **Properties**: DISTRICT (name), DISTRICT_ID, ENROLLMENT, GRADE_SPAN
- **To Replace**: Download from MassGIS Public School Districts layer
- **Instructions**: See DATA_SOURCES.md

## 🔄 How to Replace Sample Data with Real Data

### Quick Method (Recommended)

1. **Visit MassGIS**: https://www.mass.gov/info-details/massgis-data-layers
2. **Search for**: "Public School Districts" or "Census Tracts"
3. **Download**: Choose GeoJSON or Shapefile format
4. **Convert if needed**: Use https://mapshaper.org/ to convert Shapefiles to GeoJSON
5. **For Census Data**:
   - Download boundaries from MassGIS
   - Download demographic tables from Census Bureau: https://data.census.gov/
   - Join tables to boundaries using GEOID/tract ID
   - Tools: QGIS (desktop) or Python (GeoPandas)

### Detailed Instructions

See the main **DATA_SOURCES.md** file in the project root for:
- Direct download links for each dataset
- Step-by-step instructions
- Required field names and formats
- Data processing tools and tutorials
- Attribution requirements

## 📁 File Size Expectations

When you replace the sample data with real statewide data, expect these file sizes:

| Layer | Sample Size | Real Data Size (Estimated) |
|-------|-------------|----------------------------|
| municipalities.geojson | 18 MB | 18 MB (already real) |
| legislative-districts.geojson | 950 KB | 950 KB (already real) |
| eec-regions.geojson | 3.4 KB | 3.4 KB (already real) |
| population-density.geojson | 4.2 KB | **10-20 MB** (1,472 tracts) |
| median-income.geojson | 4.2 KB | **10-20 MB** (1,472 tracts) |
| child-poverty.geojson | 4.3 KB | **10-20 MB** (1,472 tracts) |
| working-parents.geojson | 4.4 KB | **10-20 MB** (1,472 tracts) |
| school-districts.geojson | 4.4 KB | **3-8 MB** (~400 districts) |

**Tip**: Use geometry simplification in Mapshaper (5-10% simplification) to reduce file sizes while maintaining visual quality for web mapping.

## ✨ What Works Right Now

Even with sample data, you can:
- ✅ Toggle all 8 data layers on/off
- ✅ See municipalities across all of Massachusetts
- ✅ See all legislative districts (House & Senate)
- ✅ See EEC regional office boundaries
- ✅ See demonstration choropleth maps for demographics
- ✅ Click on any layer to see popup information
- ✅ Understand the data structure and format needed

## 🎯 Priority for Real Data Replacement

If you want to add real data gradually, prioritize in this order:

1. **School Districts** (Most important for afterschool programs)
   - Download from: https://www.mass.gov/info-details/massgis-data-public-school-districts

2. **Child Poverty Rates** (Key equity metric)
   - Download census tracts, join with Census ACS data

3. **Median Household Income** (Socioeconomic context)
   - Same census tracts, different ACS table

4. **Working Parents** (Program demand indicator)
   - Same census tracts, different ACS table

5. **Population Density** (Coverage analysis)
   - Census tracts with population counts

## 📞 Need Help?

- **MassGIS Help**: MassGIS@mass.gov
- **Census Help**: https://ask.census.gov/
- **GeoJSON Validation**: https://geojsonlint.com/
- **Shapefile Conversion**: https://mapshaper.org/

## 📊 Data Sources Summary

| Layer | Source | URL |
|-------|--------|-----|
| Municipalities | GitHub (nblmc) | https://github.com/nblmc/massachusetts-municipal-boundaries |
| Legislative Districts | GitHub (bhrutledge) | https://github.com/bhrutledge/ma-legislature |
| EEC Regions | Mass.gov | https://www.mass.gov/service-details/eec-regional-offices |
| School Districts | MassGIS | https://www.mass.gov/info-details/massgis-data-public-school-districts |
| Census Demographics | Census Bureau + MassGIS | https://data.census.gov/ + https://www.mass.gov/info-details/massgis-data-2020-us-census |

---

**Last Updated**: January 22, 2026
**Application Status**: Fully functional with 3 complete layers and 5 demonstration layers
