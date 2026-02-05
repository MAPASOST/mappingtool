# Admin Guide: Updating Map Data

This guide explains how to update the afterschool programs data so it's visible to everyone who visits the map.

## Overview

The map displays program data from `data/programs.json` in the repository. When you update this file, **all visitors** will see the new data.

## Step-by-Step: Updating Program Data

### Step 1: Access Admin Panel

1. Go to your live map: `https://mapasost.github.io/mappingtool/`
2. Click the **"Admin"** button in the top-right corner
3. Login with:
   - **Username:** `mapadmin`
   - **Password:** `Tremont128`

### Step 2: Upload Your CSV File

1. Prepare your CSV file with program data (see format below)
2. In the admin panel, drag-and-drop your CSV file OR click "Select File"
3. Click **"Import Data"**
4. You'll see a success message showing how many programs were imported

### Step 3: Download programs.json

1. Click the **"Download programs.json"** button in the success message
2. The file will download to your computer

### Step 4: Update the Repository

You have two options:

#### **Option A: GitHub Web Interface** (Easiest - No coding required)

1. Go to: https://github.com/MAPASOST/mappingtool
2. Navigate to the **`data`** folder
3. If `programs.json` already exists:
   - Click on `programs.json`
   - Click the pencil icon (Edit this file)
   - Delete all content
   - Copy-paste the content from your downloaded file
   - Scroll down and click **"Commit changes"**
4. If `programs.json` doesn't exist:
   - Click **"Add file"** → **"Upload files"**
   - Drag your downloaded `programs.json` file
   - Click **"Commit changes"**

#### **Option B: Git Command Line** (If you're comfortable with git)

1. Place the downloaded `programs.json` file in your local repository:
   ```
   /your-repo/data/programs.json
   ```

2. Run these commands:
   ```bash
   git add data/programs.json
   git commit -m "Update afterschool programs data"
   git push
   ```

### Step 5: Verify Changes

1. Wait 1-2 minutes for GitHub Pages to rebuild
2. Visit your map: `https://mapasost.github.io/mappingtool/`
3. Do a **hard refresh** to clear cache:
   - **Windows/Linux:** `Ctrl + F5` or `Ctrl + Shift + R`
   - **Mac:** `Cmd + Shift + R`
4. You should see the updated program data!

## CSV File Format

Your CSV file must include these columns (in any order):

```csv
id,name,address,city,county,region,zip,lat,lng,phone,email,website,services,ageRange,capacity
1,Program Name,123 Main St,Boston,Suffolk,Northeast,02101,42.3601,-71.0589,(617) 555-0100,info@example.org,www.example.org,"Homework help, Sports",6-14,50
```

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| **id** | Unique identifier | 1, 2, 3... |
| **name** | Program name | "Boston Youth Center" |
| **address** | Street address | "123 Main St" |
| **city** | City name | "Boston" |
| **county** | MA county name | "Suffolk" |
| **region** | Region (see below) | "Northeast" |
| **zip** | ZIP code | "02101" |
| **lat** | Latitude | 42.3601 |
| **lng** | Longitude | -71.0589 |
| **phone** | Contact phone | "(617) 555-0100" |
| **email** | Contact email | "info@example.org" |
| **website** | Website URL | "www.example.org" |
| **services** | Services offered | "Homework help, Sports" |
| **ageRange** | Age range | "6-14" |
| **capacity** | Max students | 50 |

### Valid Regions

- **Western** - Western Massachusetts
- **Central** - Central Massachusetts
- **Northeast** - Northeast Massachusetts
- **Southeast** - Southeast Massachusetts
- **Cape** - Cape Cod & Islands

### Valid Counties

Barnstable, Berkshire, Bristol, Dukes, Essex, Franklin, Hampden, Hampshire, Middlesex, Nantucket, Norfolk, Plymouth, Suffolk, Worcester

### Getting Latitude & Longitude

Use [Google Maps](https://maps.google.com):
1. Search for the address
2. Right-click on the location marker
3. Click "What's here?"
4. Copy the coordinates (first = latitude, second = longitude)

## Download Template

In the admin panel, click **"Download CSV Template"** to get a properly formatted example file.

## Troubleshooting

### Changes not showing on the map?

1. **Clear your browser cache** - Do a hard refresh (Ctrl+F5 or Cmd+Shift+R)
2. **Wait a few minutes** - GitHub Pages can take 1-2 minutes to rebuild
3. **Check the console** - Open browser DevTools (F12) and look for errors
4. **Verify the file** - Make sure `programs.json` is at `data/programs.json` in your repo

### "No programs found" on the map?

1. Check that `data/programs.json` exists in your repository
2. Validate your JSON at https://jsonlint.com/
3. Make sure coordinates are for Massachusetts (lat ~42, lng ~-71)

### CSV upload fails in admin panel?

1. Check that all required fields are present
2. Make sure coordinates are valid numbers
3. Verify lat/lng are within Massachusetts bounds (lat: 41-43, lng: -74 to -69)

## How It Works

```
┌─────────────────────┐
│  Admin Uploads CSV  │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│ System Converts to  │
│     JSON Format     │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Admin Downloads    │
│   programs.json     │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Admin Commits to   │
│  GitHub Repository  │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│ GitHub Pages Builds │
│  (1-2 minutes)      │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  ALL USERS See New  │
│    Data on Map!     │
└─────────────────────┘
```

## Security Notes

- Admin credentials are stored in the browser session (2-hour timeout)
- The uploaded data is NOT automatically pushed to GitHub (you must download and commit manually)
- Only users with GitHub repository access can update the live data
- The CSV file is never sent to any external server

## Backup Your Data

Always keep a backup of your CSV file! If you need to make changes:
1. Download the current `programs.json` from your repository
2. Convert it back to CSV if needed (or edit the JSON directly)
3. Make your changes
4. Re-upload through the admin panel

## Need Help?

- **GitHub Pages Documentation:** https://docs.github.com/pages
- **CSV Format Issues:** Check `data/DATA_FORMAT.md` in the repository
- **Technical Issues:** Open an issue at: https://github.com/MAPASOST/mappingtool/issues

---

**Last Updated:** January 2026
