# Massachusetts Afterschool Programs Map

An interactive web application for mapping and discovering afterschool programs across Massachusetts. Features a clean, modern interface with town/city, county, and regional overlays, powered by user-uploaded database information.

## Features

- 🗺️ **Interactive Map**: Powered by Leaflet.js with smooth navigation and zoom
- 📍 **Multiple Overlays**: Toggle between town/city, county, and regional boundary views
- 🔍 **Search & Filter**: Find programs by name, location, county, or region
- 📊 **Data Import**: Upload your own program data via JSON or CSV files
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, professional interface with intuitive controls

## Quick Start

### Option 1: Open Directly in Browser

1. Open `index.html` in your web browser
2. The map will load with sample data showing 8 afterschool programs across Massachusetts

### Option 2: Run with a Local Server

For best results, especially when loading external data files:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (with http-server package)
npx http-server -p 8000
```

Then visit `http://localhost:8000` in your browser.

## Project Structure

```
mappingtool/
├── index.html              # Main HTML file
├── styles.css              # Styling and layout
├── app.js                  # Application logic and map functionality
├── data/
│   ├── sample-programs.json   # Sample data in JSON format
│   ├── sample-programs.csv    # Sample data in CSV format
│   └── DATA_FORMAT.md         # Data format documentation
└── README.md               # This file
```

## Using the Application

### Map Navigation

- **Pan**: Click and drag the map
- **Zoom**: Use mouse wheel, + / - buttons, or pinch on mobile
- **Reset View**: Click on any marker to center the map

### Search and Filters

1. **Search Box**: Type a program name, city, or ZIP code
2. **County Filter**: Filter by one of Massachusetts' 14 counties
3. **Region Filter**: Filter by geographic region (Western, Central, Northeast, Southeast, Cape Cod & Islands)
4. **Clear Filters**: Reset all filters and show all programs

### Map Overlays

Toggle visibility of boundary layers:
- ✅ **Town Boundaries**: (Enabled by default)
- ☐ **County Boundaries**: Show all 14 MA counties
- ☐ **Regional Boundaries**: Show 5 major regions

### Viewing Program Details

- **Click a marker** on the map to view program details in a popup
- **Click a program card** in the sidebar to zoom to that location
- Each popup shows:
  - Program name and full address
  - Contact information (phone, email)
  - Services offered
  - Age range and capacity

## Uploading Your Data

### Step 1: Prepare Your Data

Create a file with your afterschool program information. See `data/DATA_FORMAT.md` for complete specifications.

**Required fields for each program:**
- id, name, address, city, county, region, zip
- lat (latitude), lng (longitude)
- phone, email, website
- services, ageRange, capacity

### Step 2: Format Your File

Choose either JSON or CSV format:

**JSON Format** (`programs.json`):
```json
[
  {
    "id": 1,
    "name": "Program Name",
    "address": "123 Street",
    "city": "Boston",
    "county": "Suffolk",
    "region": "Northeast",
    "zip": "02101",
    "lat": 42.3601,
    "lng": -71.0589,
    "phone": "(617) 555-0100",
    "email": "info@program.org",
    "website": "www.program.org",
    "services": "Homework help, Sports",
    "ageRange": "6-14",
    "capacity": 50
  }
]
```

**CSV Format** (`programs.csv`):
```csv
id,name,address,city,county,region,zip,lat,lng,phone,email,website,services,ageRange,capacity
1,Program Name,123 Street,Boston,Suffolk,Northeast,02101,42.3601,-71.0589,(617) 555-0100,info@program.org,www.program.org,"Homework help, Sports",6-14,50
```

### Step 3: Upload to the Map

1. Click the **"Upload Data"** section in the sidebar
2. Click **"Choose File"** or the file input
3. Select your JSON or CSV file
4. Click **"Import Data"**
5. The map will refresh with your programs

## Massachusetts Geography Reference

### Counties (14)
Barnstable, Berkshire, Bristol, Dukes, Essex, Franklin, Hampden, Hampshire, Middlesex, Nantucket, Norfolk, Plymouth, Suffolk, Worcester

### Regions (5)
- **Western MA**: Berkshire, Franklin, Hampden, Hampshire counties
- **Central MA**: Worcester County
- **Northeast MA**: Essex, Middlesex counties (northern areas)
- **Southeast MA**: Bristol, Norfolk, Plymouth counties
- **Cape Cod & Islands**: Barnstable, Dukes, Nantucket counties

## Finding Coordinates

To get latitude/longitude for your program locations:

1. **Google Maps**: Right-click location → "What's here?" → Copy coordinates
2. **Geocoding Services**:
   - [OpenCage Geocoder](https://opencagedata.com/)
   - [Nominatim](https://nominatim.openstreetmap.org/)
   - Batch geocoding tools for multiple addresses

## Customization

### Changing the Map Style

Edit `app.js` to change the tile layer:

```javascript
// Current (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')

// Alternative: CartoDB Light
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png')

// Alternative: Esri World Imagery
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')
```

### Customizing Colors

Edit `styles.css` to change the color scheme:

```css
:root {
    --primary-color: #2563eb;  /* Blue - change to your brand color */
    --primary-hover: #1d4ed8;
    /* ... other colors ... */
}
```

### Adding More Fields

To track additional information about programs:

1. Add fields to your data file
2. Update the popup content in `app.js` → `createPopupContent()`
3. Update the program card display in `displayPrograms()`

## Technical Details

### Technologies Used
- **Leaflet.js 1.9.4**: Open-source JavaScript library for interactive maps
- **OpenStreetMap**: Free map tile provider
- **Vanilla JavaScript**: No frameworks required
- **CSS Grid & Flexbox**: Modern, responsive layout

### Browser Compatibility
- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Mobile browsers: ✅ Fully supported

### Performance
- Handles 100+ program markers efficiently
- Optimized search and filter operations
- Minimal external dependencies

## Deployment

### GitHub Pages

1. Push to GitHub
2. Go to repository Settings → Pages
3. Select branch and root folder
4. Your map will be available at `https://yourusername.github.io/mappingtool`

### Netlify

1. Create account at netlify.com
2. Drag and drop the project folder
3. Your map will be instantly deployed

### Standard Web Hosting

Upload all files to your web server via FTP/SFTP. No server-side processing required.

## Troubleshooting

**Problem**: Map doesn't load
- **Solution**: Open browser console (F12) to check for errors. Ensure internet connection for map tiles.

**Problem**: Uploaded data doesn't appear
- **Solution**: Verify your JSON/CSV format matches the required structure. Check browser console for parsing errors.

**Problem**: Coordinates are wrong
- **Solution**: Ensure latitude/longitude are correct. For MA: lat ~42, lng ~-71 (negative for west).

**Problem**: Overlays don't show
- **Solution**: Check the layer toggle checkboxes in the sidebar. Some layers need to be manually enabled.

## Future Enhancements

Potential features for future versions:
- Real-time database integration
- Advanced filtering (by age, services, capacity)
- User reviews and ratings
- Distance-based search
- Print-friendly program reports
- Export filtered results
- Multi-language support

## License

This project is open source and available for use in educational and non-profit applications.

## Support

For questions or issues:
1. Check the `data/DATA_FORMAT.md` for data format help
2. Review this README for usage instructions
3. Open an issue on the project repository

## Credits

- Map data: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- Mapping library: [Leaflet.js](https://leafletjs.com/)
- Icons and styling: Custom CSS design

---

**Made with ❤️ for Massachusetts communities**