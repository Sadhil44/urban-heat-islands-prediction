// ========================================
// URBAN HEAT ISLAND ANALYSIS - [CITY NAME]
// Author: [Your Name]
// Date: [YYYY-MM-DD]
// Description: UHI prediction using Random Forest, Markov Chain, and Cellular Automation
// ========================================

// STEP 1: DEFINE AREA OF INTEREST (AOI)
// Use Google Maps to find coordinates: Right-click → "What's here?"
// Format: [[West, North], [West, South], [East, South], [East, North]]

var aoi = ee.Geometry.Polygon([
    [[WEST_LONGITUDE, NORTH_LATITUDE],   // Top-left corner
     [WEST_LONGITUDE, SOUTH_LATITUDE],   // Bottom-left corner
     [EAST_LONGITUDE, SOUTH_LATITUDE],   // Bottom-right corner
     [EAST_LONGITUDE, NORTH_LATITUDE]]   // Top-right corner
]);

// Use the same AOI for all operations
var clippedAoi = aoi;
var predictionAoi = aoi;

// STEP 2: SET TIME PERIOD
// Recommendation: Use summer months for maximum UHI effect
var startDate = 'YYYY-MM-DD';  // Example: '2022-06-01'
var endDate = 'YYYY-MM-DD';    // Example: '2022-08-31'

// ========================================
// PREPROCESSING FUNCTIONS
// ========================================

// Apply scaling factors to convert DN to physical units
function applyScaleFactors(image) {
    var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
    var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);
    return image.addBands(opticalBands, null, true)
                .addBands(thermalBands, null, true);
}

// Cloud masking function
function maskL8sr(col) {
    var cloudShadowBitMask = (1 << 3);
    var cloudsBitMask = (1 << 5);
    var qa = col.select('QA_PIXEL');
    var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                 .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
    return col.updateMask(mask);
}

// ========================================
// LOAD AND PROCESS IMAGERY
// ========================================

var image = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterDate(startDate, endDate)
    .filterBounds(aoi)
    .map(applyScaleFactors)
    .map(maskL8sr)
    .median();

// Visualization parameters
var visualization = {
    bands: ['SR_B4', 'SR_B3', 'SR_B2'],
    min: 0.0,
    max: 0.3,
};

var imageClipped = image.clip(clippedAoi);
Map.addLayer(imageClipped, visualization, 'True Color (432)', false);

// ========================================
// CALCULATE INDICES
// ========================================

// 1. NDVI (Normalized Difference Vegetation Index)
var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
Map.addLayer(ndvi, {min:-1, max:1, palette: ['blue', 'white', 'green']}, 'NDVI', false);

// Get NDVI statistics
var ndvi_min = ee.Number(ndvi.reduceRegion({
    reducer: ee.Reducer.min(),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e9
}).values().get(0));

var ndvi_max = ee.Number(ndvi.reduceRegion({
    reducer: ee.Reducer.max(),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e9
}).values().get(0));

// 2. Fractional Vegetation
var fv = (ndvi.subtract(ndvi_min).divide(ndvi_max.subtract(ndvi_min))).pow(ee.Number(2))
    .rename('FV');

// 3. Emissivity
var em = fv.multiply(ee.Number(0.004)).add(ee.Number(0.986)).rename('EM');

// 4. Land Surface Temperature (LST)
var thermal = image.select('ST_B10').rename('thermal');

var lst = thermal.expression(
    '(tb / (1 + ((11.5 * (tb / 14380)) * log(em)))) - 273.15',
    {
        'tb': thermal.select('thermal'),
        'em': em
    }
).rename('LST');

// LST visualization
var lst_vis = {
    min: 7,
    max: 50,
    palette: [
        '040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
        '0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
        '3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
        'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
        'ff0000', 'de0101', 'c21301', 'a71001', '911003'
    ]
};

var clippedLST = lst.clip(clippedAoi);
Map.addLayer(clippedLST, lst_vis, 'LST', true);
Map.centerObject(clippedAoi, 10);

// ========================================
// CALCULATE UHI METRICS
// ========================================

// LST Statistics
var lst_mean = ee.Number(lst.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e9
}).values().get(0));

var lst_std = ee.Number(lst.reduceRegion({
    reducer: ee.Reducer.stdDev(),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e9
}).values().get(0));

print('Mean LST:', lst_mean);
print('STD LST:', lst_std);

// Urban Heat Island Index
var uhi = lst.subtract(lst_mean).divide(lst_std).rename('UHI');

var uhi_vis = {
    min: -4,
    max: 4,
    palette: ['313695', '74add1', 'fed976', 'feb24c', 'fd8d3c', 'fc4e2a', 'e31a1c', 'b10026']
};

var clippedUHI = uhi.clip(clippedAoi);
Map.addLayer(clippedUHI, uhi_vis, 'UHI', true);

// Urban Thermal Field Variance Index
var utfvi = lst.subtract(lst_mean).divide(lst).rename('UTFVI');

var utfvi_vis = {
    min: -1,
    max: 0.3,
    palette: ['313695', '74add1', 'fed976', 'feb24c', 'fd8d3c', 'fc4e2a', 'e31a1c', 'b10026']
};

var clippedUTFVI = utfvi.clip(clippedAoi);
Map.addLayer(clippedUTFVI, utfvi_vis, 'UTFVI', true);

// Calculate percentage of critical UTFVI areas (>0.05)
var totalArea = ee.Number(ee.Image.pixelArea().reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e9
}).get('area'));

var criticalUTFVI = clippedUTFVI.gt(0.05);
var areaCriticalUTFVI = criticalUTFVI.multiply(ee.Image.pixelArea()).reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: aoi,
    scale: 30,
    maxPixels: 1e9
}).get('UTFVI');

var criticalPercentage = ee.Number(areaCriticalUTFVI).divide(totalArea).multiply(100);
print('Percentage of Critical UTFVI Areas (>0.05):', criticalPercentage);

// ========================================
// EXPORT OPTIONS
// ========================================

// Export LST to Google Drive
Export.image.toDrive({
    image: clippedLST,
    description: 'CityName_LST_' + startDate.slice(0,4),
    scale: 30,
    region: clippedAoi,
    maxPixels: 1e9
});

// Export UHI to Google Drive
Export.image.toDrive({
    image: clippedUHI,
    description: 'CityName_UHI_' + startDate.slice(0,4),
    scale: 30,
    region: clippedAoi,
    maxPixels: 1e9
});

// Export UTFVI to Google Drive
Export.image.toDrive({
    image: clippedUTFVI,
    description: 'CityName_UTFVI_' + startDate.slice(0,4),
    scale: 30,
    region: clippedAoi,
    maxPixels: 1e9
});

// ========================================
// NOTES FOR CUSTOMIZATION
// ========================================

/*
TO ANALYZE A NEW CITY:
1. Update city name in header
2. Set AOI coordinates (lines 10-15)
3. Choose appropriate date range (lines 20-21)
4. Adjust LST visualization min/max if needed (lines 96-97)
5. Update export descriptions (lines 204, 212, 220)

TIPS:
- Use summer months for maximum UHI
- Make AOI large enough to capture suburbs
- Check if Landsat 8 covers your region
- Verify results make sense for local climate

TO IMPLEMENT PREDICTIVE MODELS:
- See full city examples in src/cities/
- Random Forest: Requires 2017 training data
- Markov Chain: Needs historical urban expansion
- Cellular Automation: Define neighborhood rules
*/
