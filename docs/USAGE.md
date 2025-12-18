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

**Recommendations:**
- **Summer**: Maximum UHI effect
- **Winter**: Less pronounced UHI
- **Full year**: Average conditions
- **Avoid rainy seasons**: Cloud cover issues

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

## Troubleshooting

### Error: "User memory limit exceeded"

**Solution**: Reduce the AOI size or increase scale parameter

```javascript
// Change scale from 30 to 60 or 100
var stats = lst.reduceRegion({
    scale: 100,  // Increased from 30
    // ...
});
```

### Error: "Too many cloud-covered images"

**Solution**: Adjust date range or use different season

```javascript
// Try different months
var startDate = '2022-03-01';  // Spring
var endDate = '2022-05-31';

// Or expand date range
var startDate = '2021-01-01';
var endDate = '2022-12-31';
```

### Map doesn't show anything

**Check**:
1. AOI coordinates are correct (longitude first!)
2. Date range contains available Landsat data
3. Area isn't completely cloud-covered
4. "Run" button was clicked

### Results seem incorrect

**Verify**:
1. AOI covers the right area (use `Map.centerObject(aoi, 10)`)
2. Date range is appropriate for season
3. Landsat 8 data is available for that region
4. Scale is set to 30m (not too coarse)

## Advanced Customization

### Change Color Palette

```javascript
var lst_vis = {
    min: 10,    // Adjust min temperature
    max: 45,    // Adjust max temperature
    palette: [
        '0000FF',  // Blue (cold)
        '00FFFF',  // Cyan
        '00FF00',  // Green
        'FFFF00',  // Yellow
        'FF0000'   // Red (hot)
    ]
};
```

### Add Additional Indices

```javascript
// NDBI (Built-up Index)
var ndbi = image.normalizedDifference(['SR_B6', 'SR_B5'])
                .rename('NDBI');
Map.addLayer(ndbi, {min: -1, max: 1, palette: ['blue', 'white', 'red']}, 
             'Built-up Areas');

// NDWI (Water Index)
var ndwi = image.normalizedDifference(['SR_B3', 'SR_B5'])
                .rename('NDWI');
Map.addLayer(ndwi, {min: -1, max: 1, palette: ['white', 'blue']}, 
             'Water Bodies');
```

### Compare Multiple Years

```javascript
// Load 2017 data
var image2017 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterDate('2017-05-01', '2017-12-31')
    .filterBounds(aoi)
    .map(applyScaleFactors)
    .map(maskL8sr)
    .median();

// Calculate LST for 2017
var lst2017 = /* calculate LST */;

// Load 2022 data
var image2022 = /* same process for 2022 */;
var lst2022 = /* calculate LST */;

// Calculate change
var lstChange = lst2022.subtract(lst2017);
Map.addLayer(lstChange, {min: -5, max: 5, palette: ['blue', 'white', 'red']}, 
             'LST Change 2017-2022');
```

## Best Practices

### 1. Data Quality
- ✅ Use cloud-free images (median reduces cloud impact)
- ✅ Choose appropriate seasons
- ✅ Verify Landsat 8 coverage for your region

### 2. Processing Efficiency
- ✅ Limit AOI size to necessary area
- ✅ Use appropriate scale (30m standard, 100m for large areas)
- ✅ Export only needed layers

### 3. Validation
- ✅ Compare with ground truth weather stations
- ✅ Check if results match expected patterns
- ✅ Verify vegetation/urban areas align with reality

### 4. Interpretation
- ✅ Consider local climate and geography
- ✅ Account for seasonal variations
- ✅ Understand model limitations

## Next Steps

1. **Run example cities** to understand the workflow
2. **Analyze your own city** using the template
3. **Compare results** across different models
4. **Export data** for further analysis
5. **Share findings** with community

## Getting Help

- **Google Earth Engine Documentation**: [developers.google.com/earth-engine](https://developers.google.com/earth-engine)
- **GEE Forum**: [groups.google.com/g/google-earth-engine-developers](https://groups.google.com/g/google-earth-engine-developers)
- **GitHub Issues**: Open an issue in this repository

## Resources

- [Landsat 8 Data Users Handbook](https://www.usgs.gov/landsat-missions/landsat-8-data-users-handbook)
- [EPA Urban Heat Island Basics](https://www.epa.gov/heatislands/heat-island-basics)
- [Remote Sensing of Urban Climate](https://www.mdpi.com/journal/remotesensing/special_issues/urban_climate)

---

Happy analyzing! 🌍🔥📊
