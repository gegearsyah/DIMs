
// Load a Sentinel-2 image collection.
var collection = ee.ImageCollection('COPERNICUS/S2')
  .filterDate('2018-02-01', '2018-08-31')  // Filter by date range.
  .filterBounds(roi)  // Filter by location.
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));  // Filter by cloud cover.

// Calculate the mean of the collection.
var image = collection.mean();

// Calculate NDWI.
var ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI');

// Define a mask for flooded areas (NDWI > 0.3).
var floodedMask = ndwi.gt(0.1);

// Create a visualization layer for flooded areas.
var floodedVis = ndwi.updateMask(floodedMask).visualize({
  min: 0,
  max: 1,
  palette: ['0000FF']  // Blue color for flooded areas.
});

// Display the original image and NDWI on the map.
Map.centerObject(roi, 10);
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'Sentinel-2 Image');
Map.addLayer(ndwi, {min: -1, max: 1, palette: ['blue', 'white', 'green']}, 'NDWI');
Map.addLayer(floodedVis, {}, 'Flooded Areas');

// Print the NDWI image to the console.
print(ndwi);

// Export the NDWI image to Google Drive.
Export.image.toDrive({
  image: ndwi,
  description: 'NDWI_Sentinel2',
  scale: 10,
  region: roi,
  fileFormat: 'GeoTIFF'
});
