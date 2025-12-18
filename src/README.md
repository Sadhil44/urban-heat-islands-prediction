# Source Code Directory

This directory contains all Google Earth Engine JavaScript code for Urban Heat Island analysis.

## Directory Structure

```
src/
├── cities/          # Individual city analysis scripts
│   ├── nyc.js
│   ├── dubai.js
│   ├── istanbul.js
│   ├── lagos.js
│   ├── london.js
│   ├── mumbai.js
│   ├── sao_paulo.js
│   ├── singapore.js
│   ├── tokyo.js
│   └── toronto.js
└── TEMPLATE.js      # Template for analyzing new cities
```

## Quick Usage

### Run Existing City Analysis

1. Open [Google Earth Engine Code Editor](https://code.earthengine.google.com/)
2. Copy code from any city file (e.g., `nyc.js`)
3. Paste into Code Editor
4. Click "Run"

### Analyze a New City

1. Copy `TEMPLATE.js`
2. Update coordinates and date range
3. Follow inline comments for customization
4. Save and run in Google Earth Engine

## City Files Overview

### New York City (`nyc.js`)
- **Climate**: Temperate
- **AOI**: Manhattan and surrounding boroughs
- **Key Finding**: Central Park 5-8°C cooler than downtown

### Dubai (`dubai.js`)
- **Climate**: Arid desert
- **AOI**: Dubai urban core and desert surroundings
- **Key Finding**: 47.8% of area in critical thermal stress

### Istanbul (`istanbul.js`)
- **Climate**: Mediterranean
- **AOI**: European and Asian sides spanning Bosphorus
- **Key Finding**: Topography creates diverse microclimates

### Lagos (`lagos.js`)
- **Climate**: Tropical
- **AOI**: Coastal metropolitan area
- **Key Finding**: Informal settlements show rapid heat accumulation

### London (`london.js`)
- **Climate**: Temperate oceanic
- **AOI**: Greater London including parks
- **Key Finding**: Extensive green spaces mitigate UHI effectively

### Mumbai (`mumbai.js`)
- **Climate**: Tropical monsoon
- **AOI**: Mumbai peninsula and suburbs
- **Key Finding**: High humidity intensifies thermal stress

### São Paulo (`sao_paulo.js`)
- **Climate**: Subtropical highland
- **AOI**: Urban center and favelas
- **Key Finding**: Urban sprawl stabilizing, UHI plateauing

### Singapore (`singapore.js`)
- **Climate**: Equatorial rainforest
- **AOI**: Island city-state
- **Key Finding**: Policy-driven green infrastructure successful

### Tokyo (`tokyo.js`)
- **Climate**: Humid subtropical
- **AOI**: Greater Tokyo metropolitan area
- **Key Finding**: High-density but well-managed thermal stress

### Toronto (`toronto.js`)
- **Climate**: Continental
- **AOI**: Downtown and suburban sprawl
- **Key Finding**: Seasonal UHI variation significant

## Code Structure

Each city script follows this structure:

```javascript
// 1. DEFINE AOI
var aoi = ee.Geometry.Polygon([...]);

// 2. SET DATE RANGE
var startDate = 'YYYY-MM-DD';
var endDate = 'YYYY-MM-DD';

// 3. LOAD & PREPROCESS DATA
// - Apply scaling factors
// - Cloud masking
// - Median composite

// 4. CALCULATE INDICES
// - NDVI (vegetation)
// - Emissivity
// - LST (temperature)

// 5. COMPUTE UHI METRICS
// - Urban Heat Island Index
// - UTFVI (thermal stress)

// 6. PREDICTIVE MODELS (optional)
// - Random Forest Regression
// - Markov Chain
// - Cellular Automation

// 7. VISUALIZE & EXPORT
// - Map layers
// - Statistics
// - Export to Drive
```

## Common Functions

### Preprocessing

```javascript
// Apply Landsat 8 scaling factors
function applyScaleFactors(image) {
    var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
    var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);
    return image.addBands(opticalBands, null, true)
                .addBands(thermalBands, null, true);
}

// Mask clouds and cloud shadows
function maskL8sr(col) {
    var cloudShadowBitMask = (1 << 3);
    var cloudsBitMask = (1 << 5);
    var qa = col.select('QA_PIXEL');
    var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                 .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
    return col.updateMask(mask);
}
```

### Index Calculations

```javascript
// NDVI
var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');

// Emissivity
var em = fv.multiply(0.004).add(0.986).rename('EM');

// LST
var lst = thermal.expression(
    '(tb / (1 + ((11.5 * (tb / 14380)) * log(em)))) - 273.15',
    {'tb': thermal, 'em': em}
).rename('LST');
```

## Customization Guide

### Adjust Temperature Ranges

```javascript
// Change based on local climate
var lst_vis = {
    min: 7,    // Minimum temperature (°C)
    max: 50,   // Maximum temperature (°C)
    palette: [...] // Color gradient
};
```

### Modify Date Ranges

```javascript
// Summer (Northern Hemisphere)
var startDate = '2022-06-01';
var endDate = '2022-08-31';

// Year-round average
var startDate = '2022-01-01';
var endDate = '2022-12-31';

// Specific season
var startDate = '2022-12-01'; // Winter
var endDate = '2023-02-28';
```

### Change AOI Size

```javascript
// Smaller AOI (faster processing)
var aoi = ee.Geometry.Polygon([
    [[lon_west, lat_north],
     [lon_west, lat_south],
     [lon_east, lat_south],
     [lon_east, lat_north]]
]);

// Or use buffer around a point
var center = ee.Geometry.Point([longitude, latitude]);
var aoi = center.buffer(50000); // 50km radius
```

## Best Practices

### 1. Data Quality
- ✅ Use summer data for maximum UHI
- ✅ Check for sufficient clear images
- ✅ Verify Landsat 8 coverage

### 2. Performance
- ✅ Keep AOI reasonably sized
- ✅ Use scale parameter wisely (30m for detail, 100m for speed)
- ✅ Limit date range for faster processing

### 3. Validation
- ✅ Compare with ground truth data
- ✅ Verify temperature ranges make sense
- ✅ Check that urban areas are hotter than parks

### 4. Documentation
- ✅ Comment your modifications
- ✅ Document unusual findings
- ✅ Save your results systematically

## Troubleshooting

### Issue: Out of Memory Error
**Solution**: Increase scale parameter or reduce AOI size

### Issue: No Data Appears
**Solution**: Check date range, AOI coordinates, and cloud cover

### Issue: Unexpected Results
**Solution**: Verify preprocessing steps and compare with known patterns

## Contributing

Want to add a new city? See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## Resources

- [Google Earth Engine Documentation](https://developers.google.com/earth-engine)
- [Landsat 8 Handbook](https://www.usgs.gov/landsat-missions/landsat-8-data-users-handbook)
- [Full Methodology](../docs/methodology.md)

---

**Need help?** Open an issue or discussion on GitHub.
