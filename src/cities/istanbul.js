// AOI
var aoi = ee.Geometry.Polygon(
    [[[28.5000, 41.4000], // Top-left corner
      [28.5000, 40.7000], // Bottom-left corner
      [29.5000, 40.7000], // Bottom-right corner
      [29.5000, 41.4000]]] // Top-right corner
);

var clippedAoi = ee.Geometry.Polygon(
    [[[28.5000, 41.4000], // Top-left corner
      [28.5000, 40.7000], // Bottom-left corner
      [29.5000, 40.7000], // Bottom-right corner
      [29.5000, 41.4000]]] // Top-right corner
);

var predictionAoi = ee.Geometry.Polygon(
    [[[28.5000, 41.4000], // Top-left corner
      [28.5000, 40.7000], // Bottom-left corner
      [29.5000, 40.7000], // Bottom-right corner
      [29.5000, 41.4000]]] // Top-right corner
);

var startDate = '2022-05-01'
var endDate = '2022-12-31'

// *****************************************************************************************

// Applies scaling factors.
function applyScaleFactors(image) {
var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);
return image.addBands(opticalBands, null, true)
          .addBands(thermalBands, null, true);
}

//cloud mask
function maskL8sr(col) {
// Bits 3 and 5 are cloud shadow and cloud, respectively.
var cloudShadowBitMask = (1 << 3);
var cloudsBitMask = (1 << 5);
// Get the pixel QA band.
var qa = col.select('QA_PIXEL');
// Both flags should be set to zero, indicating clear conditions.
var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
             .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
return col.updateMask(mask);
}

// Filter the collection, first by the aoi, and then by date.
var image = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
.filterDate(startDate, endDate)
.filterBounds(aoi)
.map(applyScaleFactors)
.map(maskL8sr)
.median();

var visualization = {
bands: ['SR_B4', 'SR_B3', 'SR_B2'],
min: 0.0,
max: 0.3,
};

var imageClipped = image.clip(clippedAoi)

Map.addLayer(imageClipped, visualization, 'True Color (432)', false);

// NDVI
var ndvi  = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')
Map.addLayer(ndvi, {min:-1, max:1, palette: ['blue', 'white', 'green']}, 'ndvi', false)

// ndvi statistics
var ndvi_min = ee.Number(ndvi.reduceRegion({
reducer: ee.Reducer.min(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))

var ndvi_max = ee.Number(ndvi.reduceRegion({
reducer: ee.Reducer.max(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))


// fraction of veg
var fv = (ndvi.subtract(ndvi_min).divide(ndvi_max.subtract(ndvi_min))).pow(ee.Number(2))
      .rename('FV')


var em = fv.multiply(ee.Number(0.004)).add(ee.Number(0.986)).rename('EM')

var thermal = image.select('ST_B10').rename('thermal')

// This code addresses GitHub Issue #1: Incorrect LST formula parameters
// Corrected λ to 11.5 μm and ρ to 14380 μm·K for consistent units.

var lst = thermal.expression(
    '(tb / (1 + ((11.5 * (tb / 14380)) * log(em)))) - 273.15',
    {
        'tb': thermal.select('thermal'), // Brightness temperature in Kelvin
        'em': em                        // Emissivity
    }
).rename('LST');

var date = image.get('system:time_start');



var lst_vis = {
min: 7,
max: 50,
palette: [
'040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
'0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
'3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
'ff0000', 'de0101', 'c21301', 'a71001', '911003']
}

var clippedLST = lst.clip(clippedAoi);

Export.image.toDrive({
  image: clippedLST,
  description: 'True LST',
  scale: 30
})

Map.addLayer(clippedLST, lst_vis, 'LST AOI')
Map.centerObject(clippedAoi, 10)

// Urban Heat Island ***********************************************************************

//1. Normalized UHI

var lst_mean = ee.Number(lst.reduceRegion({
reducer: ee.Reducer.mean(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))


var lst_std = ee.Number(lst.reduceRegion({
reducer: ee.Reducer.stdDev(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))



print('Mean LST in AOI', lst_mean)
print('STD LST in AOI', lst_std)


var uhi = lst.subtract(lst_mean).divide(lst_std).rename('UHI')

var uhi_vis = {
min: -4,
max: 4,
palette:['313695', '74add1', 'fed976', 'feb24c', 'fd8d3c', 'fc4e2a', 'e31a1c',
'b10026']
}

var uhi_mean = ee.Number(uhi.reduceRegion({
reducer: ee.Reducer.mean(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))


var uhi_std = ee.Number(uhi.reduceRegion({
reducer: ee.Reducer.stdDev(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))

print('Mean UHI in AOI', uhi_mean)
print('STD UHI in AOI', uhi_std)

var clippedUHI = uhi.clip(clippedAoi);
Map.addLayer(clippedUHI, uhi_vis, 'UHI AOI')

var utfvi = lst.subtract(lst_mean).divide(lst).rename('UTFVI')
var utfvi_vis = {
min: -1,
max: 0.3,
palette:['313695', '74add1', 'fed976', 'feb24c', 'fd8d3c', 'fc4e2a', 'e31a1c',
'b10026']
}

var utfvi_mean = ee.Number(utfvi.reduceRegion({
reducer: ee.Reducer.mean(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))


var utfvi_std = ee.Number(utfvi.reduceRegion({
reducer: ee.Reducer.stdDev(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))

print('Mean UTFVI in AOI', utfvi_mean)
print('STD UTFVI in AOI', utfvi_std)


var clippedUTFVI = utfvi.clip(clippedAoi);

// Percentage of critical/dangerous UTFVI areas (>0.05)

var totalArea = ee.Number(ee.Image.pixelArea().reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e9
}).get('area'));

var criticalUTFVI = clippedUTFVI.gt(0.05); // Mask for critical conditions

var areaCriticalUTFVI = criticalUTFVI.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e9
}).get('UTFVI');

var criticalUTFVIpercentage = ee.Number(areaCriticalUTFVI).divide(totalArea).multiply(100);
print('Percentage of Critical/Dangerous UTFVI Areas (>0.05):', criticalUTFVIpercentage);

Map.addLayer(clippedUTFVI, utfvi_vis, 'UTFVI AOI')


// Extract the necessary bands from the original image
var imageWithFeatures = image.addBands([ndvi, em]);  // Add NDVI and EM as features

// ****************************************************************************************
// Calculate UHI (Normalized Urban Heat Island) for the original AOI
var lst_mean = ee.Number(lst.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e9
}).get('LST'));

var lst_std = ee.Number(lst.reduceRegion({
  reducer: ee.Reducer.stdDev(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e9
}).get('LST'));

// Calculate UHI (Normalized)
var uhi = lst.subtract(lst_mean).divide(lst_std).rename('UHI');

// Define UHI classes with intervals of 1 between -4 and 4
var lstClassified = lst
  .add(7)  // Shift the values to start from 0 (i.e., -4 -> 0, -3 -> 1, ..., 3 -> 7)
  .divide(1.48275862069)     // Divide by 1 to keep the intervals of 1
  .floor()       // Round down to the nearest integer
  .clamp(0, 29)   // Ensure values are between 0 and 7 (inclusive)
  .rename('LST_class');

// Sample the data for training
var trainingData = imageWithFeatures.addBands(lstClassified).sample({
  region: aoi,  // Use the original AOI for sampling
  scale: 30,
  numPixels: 10000  // Sample a sufficient number of pixels
});

// Train the Random Forest classifier
var rfClassifier = ee.Classifier.smileRandomForest(100)  // Use 100 trees for the model
  .train({
    features: trainingData,  // Training data
    classProperty: 'LST_class',  // The target variable (UHI class)
    inputProperties: ['NDVI', 'EM']  // The input features
  });

// Apply the trained classifier to the prediction area
var classified = imageWithFeatures.clip(predictionAoi)  // Clip the image to the prediction area
  .classify(rfClassifier);  // Classify using the trained random forest model

// Visualize the classified results
var lstClassVis = {
 min: 7,
max: 50,
palette: [
'040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
'0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
'3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
'ff0000', 'de0101', 'c21301', 'a71001', '911003']
};

Map.addLayer(classified, lstClassVis, 'Predicted LST Classes');
Map.centerObject(predictionAoi, 10);

// Get the confusion matrix
var trainAccuracy = rfClassifier.confusionMatrix();
print('Confusion Matrix:', trainAccuracy);

// Calculate overall accuracy
print('Overall Accuracy:', trainAccuracy.accuracy());

// Calculate Kappa
print('Kappa Statistic:', trainAccuracy.kappa());

var classified_Mean = ee.Number(classified.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e9
}).get('LST'));

var classified_std = ee.Number(classified.reduceRegion({
  reducer: ee.Reducer.stdDev(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e9
}).get('LST'));

print('Mean LST in AOI Predicted by RFC', classified_Mean)
print('STD LST in AOI Predicted by RFC', classified_std)

// Define input layers: 2017 data
var startDate = '2017-01-01';
var endDate = '2017-12-31';

// Load Landsat 8 data and calculate required indices (NDVI, LST)
var image2017 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterDate(startDate, endDate)
  .filterBounds(aoi)
  .map(applyScaleFactors)
  .map(maskL8sr)
  .median();

var ndvi2017 = image2017.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
var thermal2017 = image2017.select('ST_B10').rename('Thermal');
var urban2017 = ndvi2017.lt(0.3).gt(0); // Assume NDVI < 0.3 represents urban areas // Assume NDVI < 0.3 is urban

var lst2017 = thermal2017.expression(
  '(tb / (1 + ((11.5 * (tb / 14380)) * log(em)))) - 273.15',
  {
    'tb': thermal2017, 
    'em': urban2017.multiply(0.004).add(0.986) // Approximate emissivity
  }
).rename('LST');

var clippedUrban2017 = urban2017.clip(clippedAoi)

Map.addLayer(clippedUrban2017, {min: 0, max: 1, palette: ['green', 'red']}, 'Urban Expansion (2017)');

// Initial UHI layer
var uhi2017 = lst2017.subtract(lst2017.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e9
}).get('LST')).rename('UHI');

// Define neighborhood kernel (e.g., 3x3)
var kernel = ee.Kernel.square({radius: 1});

// Function to simulate cellular automata rules
function applyCARules(image, iterations) {
  var result = image;
  
  for (var i = 0; i < iterations; i++) {
    var neighbors = result.convolve(kernel); // Aggregate neighborhood influence
    var growth = neighbors.gt(1).and(result.eq(0)); // Urban growth condition
    
    // Apply rules: urban spreads into surrounding areas
    result = result.where(growth, 1); // Urban expansion
  }
  return result;
}

// Simulate urban expansion (2018–2022)
var urbanCA = applyCARules(urban2017, 10); // 5 iterations = ~5 years
var predictedLST = lst2017.add(urbanCA.multiply(5)); // Assume urban increases LST by 2°C

var clippedUrbanCA = urbanCA.clip(clippedAoi);
var clippedPredictedLST = predictedLST.clip(clippedAoi);

// Visualize predictions
Map.addLayer(clippedUrbanCA, {min: 0, max: 1, palette: ['green', 'red']}, 'Urban Expansion (2022)');
Map.addLayer(clippedPredictedLST, lst_vis, 'Predicted LST (2022)');

var predictedlst_mean = ee.Number(predictedLST.reduceRegion({
reducer: ee.Reducer.mean(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))


var predictedlst_std = ee.Number(predictedLST.reduceRegion({
reducer: ee.Reducer.stdDev(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))



print('Predicted Mean LST in AOI for CA', predictedlst_mean)
print('Predicted STD LST in AOI for CA', predictedlst_std)


var uhiPredicted = predictedLST.subtract(predictedlst_mean).divide(predictedlst_std).rename('UHI')

var predicteduhi_mean = ee.Number(uhiPredicted.reduceRegion({
reducer: ee.Reducer.mean(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))


var predicteduhi_std = ee.Number(uhiPredicted.reduceRegion({
reducer: ee.Reducer.stdDev(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))

var clippedUHIPredicted = uhiPredicted.clip(clippedAoi);

var uhiPredicted_vis = {
min: -4,
max: 4,
palette:['313695', '74add1', 'fed976', 'feb24c', 'fd8d3c', 'fc4e2a', 'e31a1c',
'b10026']
}
Map.addLayer(clippedUHIPredicted, uhiPredicted_vis, 'UHI AOI')

print('Predicted Mean LST in AOI for CA', predictedlst_mean)
print('Predicted STD LST in AOI for CA', predictedlst_std)

var utfviPredicted = predictedLST.subtract(predictedlst_mean).divide(predictedLST).rename('UTFVI')
var utfviPredicted_vis = {
min: -1,
max: 0.3,
palette:['313695', '74add1', 'fed976', 'feb24c', 'fd8d3c', 'fc4e2a', 'e31a1c',
'b10026']
}

var utfviPredicted_mean = ee.Number(utfviPredicted.reduceRegion({
reducer: ee.Reducer.mean(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))


var utfviPredicted_std = ee.Number(utfviPredicted.reduceRegion({
reducer: ee.Reducer.stdDev(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))

print('Mean UTFVI in AOI for CA', utfviPredicted_mean)
print('STD UTFVI in AOI for CA', utfviPredicted_std)

// Percentage of critical/dangerous UTFVI areas (>0.05)

var clippedUTFVIPredicted = utfviPredicted.clip(clippedAoi);

var totalArea = ee.Number(ee.Image.pixelArea().reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e9
}).get('area'));

var criticalUTFVI = clippedUTFVIPredicted.gt(0.05); // Mask for critical conditions

var areaCriticalUTFVI = criticalUTFVI.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e9
}).get('UTFVI');

var criticalUTFVIpercentage = ee.Number(areaCriticalUTFVI).divide(totalArea).multiply(100);
print('Percentage of Critical/Dangerous UTFVI Areas (>0.05):', criticalUTFVIpercentage);

Map.addLayer(clippedUTFVIPredicted, utfvi_vis, 'UTFVI AOI For CA')

// Urban Expansion Prediction using Markov Chain Model
var startDate2017 = '2017-01-01';
var endDate2017 = '2017-12-31';

// Load 2017 Image
var image2017 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterDate(startDate2017, endDate2017)
  .filterBounds(aoi)
  .map(applyScaleFactors)
  .map(maskL8sr)
  .median();

var ndvi2017 = image2017.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
var urban2017 = ndvi2017.lt(0.3).gt(0); // Assume NDVI < 0.3 represents urban areas

// Transition Probability Matrix (simplified example)
var transitionProbability = ee.Image.constant(0.9); // Probability of urban area remaining urban
var expansionProbability = ee.Image.constant(0.1); // Probability of non-urban becoming urban

// Markov Chain Application
var urban2022 = urban2017.multiply(transitionProbability).add(
  urban2017.not().multiply(expansionProbability)
).round(); // Ensures binary classification

// Predict LST based on urban expansion
var predictedLST = lst.add(urban2022.multiply(5)); // Assume urban increases LST by 5°C

var clippedUrban2022 = urban2022.clip(clippedAoi);
var clippedPredictedLST = predictedLST.clip(clippedAoi);

// Visualize predictions
Map.addLayer(clippedUrban2022, {min: 0, max: 1, palette: ['green', 'red']}, 'Urban Expansion (2022)');
Map.addLayer(clippedPredictedLST, lst_vis, 'Predicted LST (2022)');

var predictedlst_mean = ee.Number(predictedLST.reduceRegion({
reducer: ee.Reducer.mean(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))


var predictedlst_std = ee.Number(predictedLST.reduceRegion({
reducer: ee.Reducer.stdDev(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))



print('Predicted Mean LST in AOI for Markov', predictedlst_mean)
print('Predicted STD LST in AOI for Markov', predictedlst_std)


var uhiPredicted = predictedLST.subtract(predictedlst_mean).divide(predictedlst_std).rename('UHI')

var uhiPredicted_mean = ee.Number(uhiPredicted.reduceRegion({
reducer: ee.Reducer.mean(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))


var uhiPredicted_std = ee.Number(uhiPredicted.reduceRegion({
reducer: ee.Reducer.stdDev(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))



print('Predicted Mean UHI in AOI for Markov', uhiPredicted_mean)
print('Predicted STD UHI in AOI for Markov', uhiPredicted_std)

var uhiPredicted_vis = {
min: -4,
max: 4,
palette:['313695', '74add1', 'fed976', 'feb24c', 'fd8d3c', 'fc4e2a', 'e31a1c',
'b10026']
}

var clippedUHIPredicted = uhiPredicted.clip(clippedAoi);

Map.addLayer(clippedUHIPredicted, uhiPredicted_vis, 'UHI AOI')

var utfviPredicted = predictedLST.subtract(predictedlst_mean).divide(predictedLST).rename('UTFVI')
var utfviPredicted_vis = {
min: -1,
max: 0.3,
palette:['313695', '74add1', 'fed976', 'feb24c', 'fd8d3c', 'fc4e2a', 'e31a1c',
'b10026']
}
var utfviPredicted_mean = ee.Number(utfviPredicted.reduceRegion({
reducer: ee.Reducer.mean(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))


var utfviPredicted_std = ee.Number(utfviPredicted.reduceRegion({
reducer: ee.Reducer.stdDev(),
geometry: aoi,
scale: 30,
maxPixels: 1e9
}).values().get(0))

print('Mean UTFVI in AOI for Markov', utfviPredicted_mean)
print('STD UTFVI in AOI for Markov', utfviPredicted_std)


var clippedUTFVIPredicted = utfviPredicted.clip(clippedAoi);

// Percentage of critical/dangerous UTFVI areas (>0.05)

var totalArea = ee.Number(ee.Image.pixelArea().reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e9
}).get('area'));

var criticalUTFVI = clippedUTFVIPredicted.gt(0.05); // Mask for critical conditions

var areaCriticalUTFVI = criticalUTFVI.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e9
}).get('UTFVI');

var criticalUTFVIpercentage = ee.Number(areaCriticalUTFVI).divide(totalArea).multiply(100);
print('Percentage of Critical/Dangerous UTFVI Areas (>0.05):', criticalUTFVIpercentage);

Map.addLayer(criticalUTFVI, {min: 0, max: 1, palette: ['green', 'red']}, 'Urban Expansion (2022)');

Map.addLayer(clippedUTFVIPredicted, utfvi_vis, 'UTFVI AOI For CA')

print(
      ui.Chart.image.series({
        imageCollection: lst, 
        region: aoi,
        reducer: ee.Reducer.median(),
        scale: 10000, // nominal scale Landsat imagery 
        xProperty: date // default
      }));