# Data Layers Directory

This directory contains GeoJSON files for various data layers displayed on the map.

## Required File Names

Place your downloaded and processed GeoJSON files in this directory with the following exact names:

### Boundary Layers
- `legislative-districts.geojson` - MA House/Senate districts
- `eec-regions.geojson` - EEC regional office service areas
- `municipalities.geojson` - All 351 MA cities and towns
- `school-districts.geojson` - School district boundaries

### Demographic Layers (Choropleth)
- `population-density.geojson` - Population density by census tract
- `median-income.geojson` - Median household income by tract/ZIP
- `child-poverty.geojson` - Percentage of children in poverty
- `working-parents.geojson` - Working parent household percentages

## Data Source

See **DATA_SOURCES.md** in the project root for detailed instructions on:
- Where to download each dataset
- How to process Shapefiles into GeoJSON
- Required attributes for each layer
- Data attribution requirements

## File Structure Example

```
data/
└── layers/
    ├── README.md (this file)
    ├── legislative-districts.geojson
    ├── eec-regions.geojson
    ├── municipalities.geojson
    ├── school-districts.geojson
    ├── population-density.geojson
    ├── median-income.geojson
    ├── child-poverty.geojson
    └── working-parents.geojson
```

## Required GeoJSON Properties

Each GeoJSON file should contain features with these properties:

### legislative-districts.geojson
```json
{
  "type": "Feature",
  "properties": {
    "name": "1st Suffolk",
    "district_id": "S1",
    "type": "Senate"
  },
  "geometry": { ... }
}
```

### municipalities.geojson
```json
{
  "type": "Feature",
  "properties": {
    "TOWN": "Boston",
    "POP2020": 675647,
    "FIPS_STCO": "25025"
  },
  "geometry": { ... }
}
```

### population-density.geojson
```json
{
  "type": "Feature",
  "properties": {
    "name": "Census Tract 101",
    "density": 12500,
    "population": 5000,
    "area_sqmi": 0.4
  },
  "geometry": { ... }
}
```

### median-income.geojson
```json
{
  "type": "Feature",
  "properties": {
    "name": "Census Tract 201",
    "median_income": 75000,
    "tract_id": "25025010100"
  },
  "geometry": { ... }
}
```

### child-poverty.geojson
```json
{
  "type": "Feature",
  "properties": {
    "name": "Census Tract 301",
    "poverty_rate": 15.5,
    "children_total": 500,
    "children_poverty": 78
  },
  "geometry": { ... }
}
```

### working-parents.geojson
```json
{
  "type": "Feature",
  "properties": {
    "name": "Census Tract 401",
    "working_parent_pct": 72.5,
    "total_households": 1200,
    "working_parent_households": 870
  },
  "geometry": { ... }
}
```

### school-districts.geojson
```json
{
  "type": "Feature",
  "properties": {
    "DISTRICT": "Boston Public Schools",
    "DISTRICT_ID": "00350000",
    "ENROLLMENT": 50000,
    "GRADE_SPAN": "PK-12"
  },
  "geometry": { ... }
}
```

## Testing Your Files

After placing GeoJSON files in this directory:

1. Open the map application in your browser
2. Check the browser console (F12) for any loading errors
3. Toggle each data layer using the checkboxes in the sidebar
4. Verify that:
   - Boundaries display correctly
   - Colors are appropriate for choropleth layers
   - Popup information appears when clicking features

## Troubleshooting

**Layer not appearing?**
- Check browser console for errors
- Verify file name matches exactly (case-sensitive)
- Validate GeoJSON at https://geojsonlint.com/
- Ensure file is valid UTF-8 encoding
- Check that required properties exist

**Wrong colors on choropleth?**
- Verify property names match expected values
- Check that numeric values are numbers, not strings
- Adjust color ranges in `app.js` if needed

**File too large?**
- Simplify geometry using https://mapshaper.org/
- Reduce precision of coordinates
- Remove unnecessary properties

## File Size Guidelines

- Municipalities: ~5-10 MB
- Legislative districts: ~2-5 MB
- Census tracts: ~10-20 MB
- School districts: ~3-8 MB

**Tip**: Simplify geometries to reduce file size while maintaining visual quality. Use Mapshaper with 5-10% simplification for most use cases.

## Data Updates

- **Census data**: Update annually when new ACS data is released
- **Boundaries**: Update after redistricting (every 10 years)
- **School districts**: Check annually for changes

---

**Need help?** Refer to DATA_SOURCES.md for complete download and processing instructions.
