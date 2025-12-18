# Usage Guide

This guide will help you run the Urban Heat Island prediction analysis for any city using Google Earth Engine.

## Prerequisites

### 1. Google Earth Engine Access
- Sign up for a free account at [earthengine.google.com](https://earthengine.google.com/)
- Wait for approval (usually instant for educational use)
- Access the Code Editor at [code.earthengine.google.com](https://code.earthengine.google.com/)

### 2. Basic Knowledge
- JavaScript fundamentals
- Basic understanding of remote sensing concepts
- Familiarity with geographic coordinates

## Quick Start

### Running Analysis for Existing Cities

1. **Open Google Earth Engine Code Editor**

2. **Choose a city** from `src/cities/` directory
   - Example: `nyc.js`, `dubai.js`, `tokyo.js`, etc.

3. **Copy the entire code** and paste into GEE Code Editor

4. **Click "Run"** button (or press Ctrl+Enter)

5. **View results** in the map panel:
   - LST (Land Surface Temperature)
   - UHI (Urban Heat Island Index)
   - UTFVI (Urban Thermal Field Variance Index)
   - Predicted maps from all three models

### Example Workflow

```javascript
// The code is already set up for NYC
// Just run it directly!

// To export results:
// 1. Go to "Tasks" tab
// 2. Click "Run" next to "True LST" export
// 3. Choose Google Drive destination
// 4. Download the exported GeoTIFF
```

## Analyzing a New City

### Step 1: Define Area of Interest (AOI)

Find the coordinates for your city using [Google Maps](https://maps.google.com/):
1. Right-click on the map → "What's here?"
2. Note the latitude and longitude

Example for Paris, France:
```javascript
var aoi = ee.Geometry.Polygon([
    [[2.224, 48.902],     // Top-left (longitude, latitude)
     [2.224, 48.816],     // Bottom-left
     [2.470, 48.816],     // Bottom-right
     [2.470, 48.902]]     // Top-right
]);
```

**Tips:**
- Use decimal degrees (not DMS format)
- Longitude comes first, then latitude
- Make the box large enough to include suburban areas
- Check the map preview to ensure coverage

### Step 2: Set Date Range

Choose dates based on seasonal considerations:

```javascript
// For summer UHI (Northern Hemisphere)
var startDate = '2022-06-01';
var endDate = '2022-08-31';

// For year-round analysis
var startDate = '2022-01-01';
var endDate = '2022-12-31';
```

### Step 3: Customize the Script

Use this template (based on NYC code):

```javascript
// ========================================
// URBAN HEAT ISLAND ANALYSIS - [CITY NAME]
// ========================================

// Define Area of Interest
var aoi = ee.Geometry.Polygon([
    [[WEST, NORTH],   // Top-left
     [WEST, SOUTH],   // Bottom-left
     [EAST, SOUTH],   // Bottom-right
     [EAST, NORTH]]   // Top-right
]);

// Use the same AOI for all clipping operations
var clippedAoi = aoi;
var predictionAoi = aoi;

// Set time period
var startDate = '2022-05-01';
var endDate = '2022-12-31';

// Copy the rest of the code from any city file
// The processing pipeline is identical for all cities
```

### Step 4: Run and Interpret Results

The code generates several map layers:

1. **True Color (432)**: RGB image of the area
2. **NDVI**: Vegetation health (green = healthy plants)
3. **LST AOI**: Land Surface Temperature (red = hot, blue = cool)
4. **UHI AOI**: Urban Heat Island intensity
5. **UTFVI AOI**: Ecological thermal stress classification

**Console Output:**
```
Mean LST in AOI: 26.8°C
STD LST in AOI: 5.2°C
Mean UHI in AOI: 0.01
STD UHI in AOI: 1.02
Mean UTFVI in AOI: 0.018
Percentage of Critical UTFVI Areas: 38.3%
```

## Understanding the Models

### Model 1: Random Forest Regression

**What it does**: Uses machine learning to predict 2022 temperatures based on 2017 patterns

**When to use**: Default choice for all cities

**Output layers**:
- `LST Predicted By RFR`: Temperature map
- `UHI Predicted By RFR`: Heat island map
- `UTFVI Predicted By RFR`: Ecological stress map

**Interpretation**: Compare predicted vs. actual (base) maps

### Model 2: Markov Chain

**What it does**: Probabilistic urban expansion simulation

**When to use**: Stable, mature cities (London, Tokyo, Toronto)

**Output layers**:
- `LST Predicted By MC`
- `UHI Predicted By MC`
- `UTFVI Predicted By MC`

**Strengths**: Fast, efficient, good for predictable growth

### Model 3: Cellular Automation

**What it does**: Neighborhood-based growth simulation

**When to use**: Rapidly expanding cities (Lagos, Dubai, Mumbai)

**Output layers**:
- `LST Predicted By CA`
- `UHI Predicted By CA`
- `UTFVI Predicted By CA`

**Strengths**: Captures spatial clustering of urban development

## Exporting Results

### Export to Google Drive

```javascript
Export.image.toDrive({
    image: clippedLST,
    description: 'CityName_LST_2022',
    scale: 30,              // 30m resolution
    region: clippedAoi,
    maxPixels: 1e9
});
```

After running, go to the **Tasks** tab and click **Run** on each export.

### Export Statistics to CSV

```javascript
var stats = lst.reduceRegion({
    reducer: ee.Reducer.mean().combine({
        reducer2: ee.Reducer.stdDev(),
        sharedInputs: true
    }),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e9
});

print('Statistics:', stats);
// Copy-paste from console into spreadsheet
```
## Resources

- [Landsat 8 Data Users Handbook](https://www.usgs.gov/landsat-missions/landsat-8-data-users-handbook)
- [EPA Urban Heat Island Basics](https://www.epa.gov/heatislands/heat-island-basics)
- [Remote Sensing of Urban Climate](https://www.mdpi.com/journal/remotesensing/special_issues/urban_climate)

---

Happy analyzing!
