//////Important
// Yield data uploaded to GEE already in a clean format (filter rules on combine harvester speed, yield and spatial filtering for disturbance points)
// In addition, all yield points located inside the 20m pixel of Sentinel-2 were averaged and yield data uploaded as the centroid of that pixel

// Define the path to eh yield data asset 
var yieldData=ee.FeatureCollection('projects/pslchickpea/assets/yield_all');

// Center the map on the yield data extent
var bounds = yieldData.geometry().bounds();
Map.centerObject(bounds, 10); // Adjust zoom level (10 is moderate zoom)

// Define Sentinel-2 specific images from which the reflectance will be extracted
// var are defined below as images for demonstration
// 
var image1 = ee.Image('COPERNICUS/S2_SR_HARMONIZED/20230505T081609_20230505T083042_T36SXA')
  .select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8A', 'B11', 'B12']);

// Sentinel-2 sxb may 05
var image2 = ee.Image('COPERNICUS/S2_SR_HARMONIZED/20230505T081609_20230505T083042_T36SXB')
  .select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8A', 'B11', 'B12']);

// Combine the two images into one using mosaic
var sxa_sxb_combined = ee.ImageCollection([image1,image2]).mosaic();

// Visualization parameters for RGB bands to see the mosaic
var visParams = {
  bands: ['B4', 'B3', 'B2'], // Red, Green, Blue bands
  min: 0,                    // Minimum reflectance value
  max: 3000,                 // Maximum reflectance value
  gamma: 1.4                 // Optional gamma adjustment for visualization
};

// Add the mosaic image to the map
Map.addLayer(sxa_sxb_combined, visParams, 'Mosaic RGB');

// Print to confirm
print('Combined Image', sxa_sxb_combined);

// Add the combined image to the map (example visualization)
Map.addLayer(sxa_sxb_combined, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'Mosaic');

// Add the yield data to the map with red points
Map.addLayer(yieldData, {color: 'red'}, 'Yield Data');

//Directly sample reflectance values at yield locations
//This function is basically iterating over each row in the yield data and matching its Sentinel-2 reflectance
var trainingData = yieldData.map(function(feature) {
  var reflectanceValues = sxa_sxb_combined.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: feature.geometry(),
    scale: 20,
    maxPixels: 1e9
  });
  return feature.set(reflectanceValues);
});

// print to examine
print(trainingData)

// Train the Random Forest regression model
var trainedRF = ee.Classifier.smileRandomForest({
  numberOfTrees: 100,
  variablesPerSplit: 3,
  seed: 42 // Set seed for deterministic results
}).setOutputMode('REGRESSION')
  .train({
    features: trainingData,
    classProperty: 'yield', // Yield is the response variable
    inputProperties: ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8A', 'B11', 'B12'] // Predictors
  });

// Define the asset ID where the classifier will be saved
var classifierAssetId = 'projects/pslchickpea/assets/trained_rf_yield_model';

// Export the trained Random Forest classifier to your Earth Engine assets
Export.classifier.toAsset({
  classifier: trainedRF,
  description: 'ExportedRFYieldModel',
  assetId: classifierAssetId
});
