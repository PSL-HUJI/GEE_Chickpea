//////////////////// Start of user interface part
// User interface - code main objective:
// Farmers-friendly, requiring minimal inputs from the farmer to ensure ease of use and simplicity

// Create a title label for the app
var title = ui.Label({
  value: 'Chickpea Grain Weight Modeling and Grain Yield Forecast',
  style: {fontSize: '15px', fontWeight: 'bold', margin: '10px', backgroundColor: 'rgba(0,0,0,0)'}
});

// Create a left panel for the user to inser sowing date, date of interest and populate mechanistic and empirical model buttons
var controlPanel = ui.Panel({
  style: {
    width: '300px',
    padding: '8px',
    margin: '0',
    backgroundColor: '#f7f7f7'
  }
});

// Add title to the control panel
controlPanel.add(title);

// Add short instructions label to the control panel
var instructionsLabel = ui.Label({
  value: 'Please mark the field using the polygon map tools.',
  style: {fontSize: '14px', margin: '10px', backgroundColor: 'rgba(0,0,0,0)'}
});
controlPanel.add(instructionsLabel);

// Create a label for the sowing date
var sowingDateLabel = ui.Label({
  value: 'Sowing Date',
  style: {fontSize: '15px', fontWeight: 'bold', margin: '10px', backgroundColor: 'rgba(0,0,0,0)'}
});

// Create a Textbox for the sowing date input
var sowingDateInput = ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  style: {width: '250px'}
});

// Add the sowing date label and input to the control panel
controlPanel.add(sowingDateLabel);
controlPanel.add(sowingDateInput);

// Create a label for the date of interest
var dateOfInterestLabel = ui.Label({
  value: 'Date of Interest',
  style: {fontSize: '15px', fontWeight: 'bold', margin: '10px', backgroundColor: 'rgba(0,0,0,0)'}
});

// Create a Textbox for the date of interest input
var dateOfInterestInput = ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  style: {width: '250px'}
});

// Add the date of interest label and input to the control panel
controlPanel.add(dateOfInterestLabel);
controlPanel.add(dateOfInterestInput);

// Add computation button - when clicked it will start the simulation
var computeButton = ui.Button({
  label: 'Model Chickpea AGB and GY',
  onClick: onS2ButtonClick,
  style: {width: '250px'}
});

// Add the computation button to the control panel
controlPanel.add(computeButton);

// Add a prediction button - when clicked it will start the yield forecasting
var predictionButton = ui.Button({
  label: 'Forecast Chickpea Yield',
  onClick: onPredictionButtonClick,
  style: {width: '250px'}
});

// Add the prediction button to the control panel
controlPanel.add(predictionButton);

// Create a main map panel
var mapPanel = ui.Map();
mapPanel.setOptions('HYBRID'); // Use 'HYBRID' for an updated satellite and road overlay

// Add the drawing tools to the map
var drawingTools = mapPanel.drawingTools();
drawingTools.setShown(true);
drawingTools.setDrawModes(['polygon']);

// Set the initial map center and zoom level, can be adjusted
mapPanel.setCenter(35.2137, 31.7683, 8); // Adjust the coordinates and zoom level as needed

// Create a split panel to contain the control panel and the map
var splitPanel = ui.SplitPanel({
  firstPanel: controlPanel,
  secondPanel: mapPanel,
  orientation: 'horizontal',
  style: {stretch: 'both'}
});

// Add the split panel to the root UI
ui.root.clear();
ui.root.add(splitPanel);

// Hidden explanation pannel
// Create the explanation panel with guidance
var explanationPanel = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical'),
  style: {
    position: 'top-center',
    width: '300px',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  }
});

// Add title and content to the explanation panel
explanationPanel.add(ui.Label({
  value: 'Instructions',
  style: {fontWeight: 'bold', fontSize: '16px', margin: '0 0 8px 0'}
}));

explanationPanel.add(ui.Label({
  value: '1. Draw the polygon for your field on the map.',
  style: {fontSize: '14px', margin: '5px'}
}));

explanationPanel.add(ui.Label({
  value: '2. Enter the sowing date and date of interest.',
  style: {fontSize: '14px', margin: '5px'}
}));

explanationPanel.add(ui.Label({
  value: '3. Click "Model Chickpea AGB and GY" or "Forecast Chickpea Yield"',
  style: {fontSize: '14px', margin: '5px'}
}));

explanationPanel.add(ui.Label({
  value: 'The Plant Sensing Laboratory, The Robert H. Smith Faculty of Agriculture, Food and Environment, The Hebrew University of Jerusalem, P.O. Box 12, Rehovot 7610001, ISRAEL',
  style: {fontSize: '16px', margin: '10px',fontWeight: 'bold'}
}));

// Add a close button to hide the explanation panel
var closeButton = ui.Button({
  label: 'Close',
  onClick: function() {
    ui.root.widgets().remove(explanationPanel);
  },
  style: {width: '100px', margin: '8px'}
});
explanationPanel.add(closeButton);

// EXPLANATION BUTTON SETUP
// Create the "Show Explanation" button and position it in the bottom-left of mapPanel
var explanationButton = ui.Button({
  label: 'How to use',
  onClick: function() {
    ui.root.widgets().add(explanationPanel); // Show the explanation panel when clicked
  },
  style: {
    position: 'bottom-left',
    padding: '8px',
    margin: '10px',
    width: '150px',
  }
});

// Add the explanation button to the mapPanel
mapPanel.add(explanationButton);

// Initialize the polygon drawing handler
function handlePolygonDrawing() {
  drawingTools.onDraw(function(event) {
    var geometries = [];
    drawingTools.layers().forEach(function(layer) {
      var object = layer.getEeObject();
      if (object && (object instanceof ee.Geometry)) {
        geometries.push(object);
      }
    });
    // Handle the geometries as needed, e.g., print them to the console
    if (geometries.length > 0) {
      print('Drawn geometries:', geometries);
    }
  });

  drawingTools.onEdit(function(event) {
    var geometries = [];
    drawingTools.layers().forEach(function(layer) {
      var object = layer.getEeObject();
      if (object && (object instanceof ee.Geometry)) {
        geometries.push(object);
      }
    });
    // Handle the geometries as needed, e.g., print them to the console
    if (geometries.length > 0) {
      print('Edited geometries:', geometries);
    }
  });
}

handlePolygonDrawing();

// adding global legend same for all layers  - tons per hectare from zero to ten
// Function to create and add the legend to the map
function addLegend() {
  var legendPanel = ui.Panel({
    style: {
      position: 'top-center',
      padding: '8px 15px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)'
    }
  });

  // Legend title
  var legendTitle = ui.Label({
    value: 'Predicted Yield (ton/ha)',
    style: { fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px 0', textAlign: 'center' }
  });
  legendPanel.add(legendTitle);

  // Create color bar using a gradient
  var colorBar = ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: {
      bbox: [0, 0, 1, 0.1],
      dimensions: '100x10',
      format: 'png',
      min: 0,
      max: 1,
      palette: ['blue', 'green', 'yellow', 'orange', 'red']
    },
    style: { stretch: 'horizontal', margin: '8px 0' }
  });
  legendPanel.add(colorBar);

  // Add min, mid, and max labels for the color bar
  var legendLabels = ui.Panel({
    layout: ui.Panel.Layout.flow('horizontal'),
    style: { margin: '0px 8px', fontSize: '12px' }
  });

  var minLabel = ui.Label('0 (low)');
  var midLabel = ui.Label('5.5 (moderate)');
  var maxLabel = ui.Label('10 (high)');

  legendLabels.add(minLabel);
  legendLabels.add(ui.Label({ value: '   ' })); // Spacer
  legendLabels.add(midLabel);
  legendLabels.add(ui.Label({ value: '   ' })); // Spacer
  legendLabels.add(maxLabel);

  legendPanel.add(legendLabels);

  // Add the legend panel to the map
  mapPanel.add(legendPanel);
}

// Call the addLegend function once during initialization
addLegend();
//////////////////// End of user interface part

//////////////////// Start of backend mechanistic model computation part
// This section in the code is the main computation
function onS2ButtonClick() {
    // Defining the sowing date and date of interest based on user inputs
    var sowingDate = ee.Date(sowingDateInput.getValue());
    var dateOfInterest = ee.Date(dateOfInterestInput.getValue());
    
    // Get the drawn geometries (polygons)
    var geometries = [];
    drawingTools.layers().forEach(function(layer) {
        var object = layer.getEeObject();
        if (object && (object instanceof ee.Geometry)) {
            geometries.push(object);
        }
    });

    if (geometries.length === 0) {
        print('No geometries drawn. Please draw a polygon on the map.');
        return;
    }

    var region = ee.Geometry.MultiPolygon(geometries);
    
    // Inquire the last date of the AgERA5 data set inside the time duration entered by the user
    var agera5_ic = ee.ImageCollection('projects/climate-engine-pro/assets/ce-ag-era5/daily')
        .filterDate(sowingDate, dateOfInterest);
        
   // Inquire what is the last AgERA5 avaialable date in order to limit Sentinel-2 range
   // AgERA 5 data set is the limiting data set since it is updated in GEE in seven days lag time
    var latestAgERA5Date = ee.Date(agera5_ic.aggregate_max('system:time_start'));

    // Define Sentinel-2 surface reflectance dataset and filter it based on time period and cloud precentages
    var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterDate(sowingDate, latestAgERA5Date) // Filter by sowing date and date of interest
    .filterBounds(region)
    .map(function(image) {
        // Mask out non-clear pixels based on the SCL band
        var scl = image.select('SCL'); // Scene Classification Layer
        var clearPixels = scl.eq(4).or(scl.eq(5)); // 4: Vegetation, 5: Bare soil

        // Count the total pixels in the region
        var totalPixelCount = image.reduceRegion({
            reducer: ee.Reducer.count(),
            geometry: region,
            scale: 10, // Sentinel-2 resolution
            maxPixels: 1e9
        }).values().get(0);
        
        // Count the clear pixels in the region
        var clearPixelCount = image.updateMask(clearPixels)
            .reduceRegion({
                reducer: ee.Reducer.count(),
                geometry: region,
                scale: 10, // Sentinel-2 resolution
                maxPixels: 1e9
            }).values().get(0);

        // Add a property indicating if all pixels are clear
        var allPixelsClear = ee.Number(clearPixelCount).eq(ee.Number(totalPixelCount));
        return image.set('allPixelsClear', allPixelsClear);
    })
    .filter(ee.Filter.eq('allPixelsClear', 1));
    
    // Get the last available date from the filtered Sentinel-2 images that available based on the AgERA5 date range
    var latestSentinel2Date = ee.Date(sentinel2.aggregate_max('system:time_start'));

    // Get the MGRS tile ID of the first image - to use only one tile because there is a chance for overlapping tiles
    var firstImage = sentinel2.first();
    var mgrsTile = firstImage.get('MGRS_TILE');

    // Filter the collection to include only images from one tile
    sentinel2 = sentinel2.filter(ee.Filter.eq('MGRS_TILE', mgrsTile));
  
    // Clip the image collection to the region and calculate LAI for each image based on
    // Simple linear regression between Sentinel-2 NDVI (B4 and B8) 10m (404 ground truth measurments)
    var laiCollection = sentinel2.map(function(image) {
        var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
        var lai = ndvi.multiply(14.72).subtract(2.83).rename('LAI');
        return lai.clip(region).set('system:time_start', image.get('system:time_start'));
    });
    
    // To decide which sentinel-2 LAI layers will be taken for computation  - the field LAI average is being calculated
    // Calculate the average LAI for each image
    var laiAverages = laiCollection.map(function(image) {
        var laiMean = image.reduceRegion({
            reducer: ee.Reducer.mean(),
            geometry: region,
            scale: 10,
            maxPixels: 1e9
        }).get('LAI');
        return image.set('LAI_Mean', laiMean);
    });

    // Extract all the LAI layers dates 
    var laiDates = laiAverages.aggregate_array('system:time_start').map(function(date) {
        return ee.Date(date).format('YYYY-MM-dd');
    });
    // Extract all the LAI layers average LAI
    var laiMeanValues = laiAverages.aggregate_array('LAI_Mean');
    
    // Convert to JavaScript objects - this step is neccesary to understand which LAI Sentinel-2 images are needed for the simulation
    // Algorithm - taking the first image that its LAI average increase above 1.5, than continue to add untill it going down after the maximum below 2
    // If it is not going above 2 - it will take the most recent date
    // The most time demanding step in the application since it is a client side functions - might be improved if it can be done on the server. 
    laiDates.getInfo(function(laiDatesJS) {
        laiMeanValues.getInfo(function(laiMeanValuesJS) {
            // Create a JavaScript array of objects containing date and LAI_Mean
            var laiData = [];
            for (var j = 0; j < laiDatesJS.length; j++) {
                laiData.push({
                    date: ee.Date(laiDatesJS[j]).format('YYYY-MM-dd').getInfo(),
                    laiMean: laiMeanValuesJS[j]
                });
            }

            // Initialize variables
            var firstDateAboveThreshold = null;
            var lastDropBelowThreshold = null;
            var maxLAI = -Infinity; // Track the maximum LAI value
            var maxReachedIndex = -1; // Index of the maximum LAI value

            // Iterate over laiData to find the first date with LAI >= 1.5
            for (var k = 0; k < laiData.length; k++) {
              var laiMean = laiData[k].laiMean;
              var currentDate = laiData[k].date;

              // Check for the first date with LAI >= 1.5
              if (!firstDateAboveThreshold && laiMean >= 1.5) {
                firstDateAboveThreshold = currentDate;
              }

              // Track the maximum LAI and its index
              if (laiMean > maxLAI) {
                maxLAI = laiMean;
                maxReachedIndex = k;
              }
            }
            
            // Look for the first drop below 2 after the maximum LAI
            if (maxReachedIndex >= 0) {
              for (var idx = maxReachedIndex; idx < laiData.length; idx++) {
                var laiMeanAfterMax = laiData[idx].laiMean; // Unique variable name
                var dateAfterMax = laiData[idx].date;       // Unique variable name

                if (laiMeanAfterMax < 2) {
                  lastDropBelowThreshold = dateAfterMax;
                  break; // Stop iterating once the condition is met
                }
              }
            }
            
             // Apply the additional rule
            if (maxLAI < 2 || !lastDropBelowThreshold) {
              lastDropBelowThreshold = laiData[laiData.length - 1].date; // Use the last available Sentinel-2 date
            }

            // Simulation prepration
            // Overall objective - build a daily images from sowing date to the last date of LAI rasters by linear interpolation
            // Add one day to lastDecreaseDate to include the last decrease date in the filtering of Sentinel-2 LAI layers
            var lastDecreaseDatePlusOne = ee.Date(lastDropBelowThreshold).advance(1, 'day');

            // Filter the laiCollection based on the identified dates, including the lastDecreaseDate
            var laiCollection_for_analysis = laiCollection.filter(ee.Filter.date(firstDateAboveThreshold, lastDecreaseDatePlusOne))
                .sort('system:time_start'); // Ensure the collection is sorted by date

            // Add an image with zero value pixels and timestamp of the sowing date
            var zeroImage = ee.Image(0).rename('LAI')
                .clip(region)
                .set('system:time_start', sowingDate.millis());
            
            laiCollection_for_analysis = laiCollection_for_analysis.merge(ee.ImageCollection([zeroImage]));
            
            // Sort the collection by date
            laiCollection_for_analysis = laiCollection_for_analysis.sort('system:time_start');
            
            // Set the timestamp to 00:00:00 for all images before processing pairs
            laiCollection_for_analysis = laiCollection_for_analysis.map(function(image) {
                var dateWithZeroTime = ee.Date(image.get('system:time_start')).update({
                    'hour': 0,
                    'minute': 0,
                    'second': 0,
                });
                return image.set('system:time_start', dateWithZeroTime.millis());
            });
            // The overall goal is to create daily LAI raster layers between sowing date to last date of sentinel-2 LAI layer
            // To achieve it: the collection is divided to image pairs be chronolgical order
            // between each pair daily LAI rate is calculated and than cumulative sum
            // Create a list of image pairs
            var laiList = laiCollection_for_analysis.toList(laiCollection_for_analysis.size());
            var imagePairList = ee.List.sequence(0, laiList.size().subtract(2)).map(function(i) {
                return ee.List([
                    laiList.get(i),
                    laiList.get(ee.Number(i).add(1))
                ]);
            });

            // Function to process each image pairs ordered by time and compute daily lai rate between them 
            var processImagePair = function(pair) {
                pair = ee.List(pair);
                var img0 = ee.Image(pair.get(0));
                var img1 = ee.Image(pair.get(1));
                
                // Calculate the number of days between the two images
                var time0 = ee.Date(img0.get('system:time_start'));
                var time1 = ee.Date(img1.get('system:time_start'));
                var daysBetween = time1.difference(time0, 'day');
                
                // Compute the daily rate
                var dailyRate = img1.subtract(img0).divide(daysBetween);
                
                // Create a list of images by copying the dailyRate for each day in the period
                var dailyRateList = ee.List.sequence(1, daysBetween).map(function(day) {
                    var date = time0.advance(ee.Number(day).subtract(1), 'day');
                    return dailyRate.set('system:time_start', date.millis());
                });

                return dailyRateList;
            };
            
            // Apply the processing function to each pair of images
            var dailyImageLists = imagePairList.map(processImagePair);

            // Flatten the list of lists into a single list of images
            var flattenedImageList = ee.ImageCollection.fromImages(dailyImageLists.flatten());
          
            // Ensure all images in flattenedImageList are of type Float without altering pixel values
            var floatImageList = flattenedImageList.map(function(image) {
                return image.toFloat();  // Convert to float type
            });
            
            // Define "start" as the earliest date in floatImageList and "end" as the latest date
            var start = ee.Date(floatImageList.aggregate_min('system:time_start'));
            var end = ee.Date(floatImageList.aggregate_max('system:time_start')).advance(1, 'day');
            
            // Initialize with a zero-image to start the cumulative sum
            var initialImage = ee.Image(0).set('system:time_start', floatImageList.first().get('system:time_start')).rename('cumulative_lai');
            var initialCumulativeList = ee.List([initialImage]);
            
            // Define the accumulate function for cumulative sum
            var accumulateCumulativeLai = function(image, list) {
              list = ee.List(list);  // Ensure the list is cast correctly
              var previousCumulative = ee.Image(list.get(-1));  // Get the last cumulative image

              // Add the current image to the cumulative sum
              var cumulativeLai = previousCumulative.add(image).rename('cumulative_lai')
              .set('system:time_start', image.get('system:time_start'));  // Set date metadata

              // Append the new cumulative image to the list
              return list.add(cumulativeLai);
            };
            
            // Apply the accumulate function using iterate to get the cumulative LAI rate list
            var cumulativeLaiList = ee.List(floatImageList.iterate(accumulateCumulativeLai, initialCumulativeList));

            // Convert the cumulative list to an ImageCollection and remove the initial zero image
            var cumulativeLaiCollection = ee.ImageCollection(cumulativeLaiList.slice(1));
            
            // Create a new image collection 'intercepted_radiation' using the formula exp(pixel value * -0.5)
            // this step taking all the LAI layers and basically computing per pixel for each layer what is the fraction of the intercepted solar radiaion
            var intercepted_radiation = cumulativeLaiCollection.map(function(image) {
               return image.multiply(-0.5).exp().multiply(-1).add(1)  // Equivalent to 1 - exp(-0.5 * LAI)
                .rename('intercepted_radiation')
                .set('system:time_start', image.get('system:time_start'));
            });
            
            // Filter agera5_ic to match the date range from sowingDate to lastDecreaseDate
            var filtered_agera5_ic_radiation = agera5_ic
            .filterDate(start, end)
            .select('Solar_Radiation_Flux');
            
            // To lower the chance of falling on a pixel without data, the polygon entered by the user 
            // Was enlarged to include neighbours assuming radiation is not changing a lot between neighbour pixels
            var bufferedRegion = region.buffer(10000);  // 10,000 meters = 10 km
            
            // Extract mean radiation values in Joules for each image and transform to Megajoules, with null handling
            var radiationValues = filtered_agera5_ic_radiation.map(function(image) {
              var meanRadiation = image.reduceRegion({
                reducer: ee.Reducer.mean(),
                geometry: bufferedRegion,
                scale: 10000,  // Match the resolution of AgERA5 data (10 km)
                maxPixels: 1e9
              }).get('Solar_Radiation_Flux');
  
              // Check if meanRadiation is null and set to 0 if so
              var meanRadiationMJ = ee.Algorithms.If(
                meanRadiation,                        // If meanRadiation is not null,
                ee.Number(meanRadiation).divide(1e6).multiply(10000), // convert it to Megajoules,
                0                                     // otherwise set it to 0
              );
              return image.set('mean_radiation_MJ', meanRadiationMJ)
            .set('system:time_start', image.get('system:time_start')); // Preserve timestamp
            });

            //Collect the transformed Megajoule values into a list, ordered by time
            var radiationValuesListMJ = radiationValues.aggregate_array('mean_radiation_MJ');

            // Define your constant factor here
            var chosenConstant = ee.Number(0.0000003151);  

            // Multiply each image in intercepted_radiation by its corresponding Megajoule scalar and constant
            var biomassPerDayCollection = intercepted_radiation.map(function(image) {
              // Get the index of this image in the collection and use it to get the corresponding radiation value
              var index = ee.Number(image.get('system:time_start')).subtract(sowingDate.millis()).divide(24 * 60 * 60 * 1000).floor();
              var radiationScalarMJ = ee.Number(radiationValuesListMJ.get(index));
            
              // Apply scalar multiplication
              var biomass = image
                .multiply(radiationScalarMJ)  // Multiply each pixel by the Megajoule value
                .multiply(chosenConstant)     // Apply the constant factor
                .rename('biomass_per_day')
                .set('system:time_start', image.get('system:time_start'));  // Preserve the timestamp
              return biomass;
            });
            
            // Extract dates and Biomass values
            var biomassDates = biomassPerDayCollection.aggregate_array('system:time_start').map(function(date) {
              return ee.Date(date).format('YYYY-MM-dd');
            });
            
            var biomassAverages = biomassPerDayCollection.map(function(image) {
              var biomassMean = image.reduceRegion({
                reducer: ee.Reducer.mean(),
                geometry: region,
                scale: 10, // Adjust scale to match your resolution
                maxPixels: 1e9
              }).get('biomass_per_day'); // Replace 'Biomass' with the correct band name if needed

              return image.set('Biomass_Mean', biomassMean);
            });
            
            var biomassValues = biomassAverages.aggregate_array('Biomass_Mean');
          
            // Sum all images in biomassPerDayCollection to get the total biomass for the entire period
            var totalBiomass = biomassPerDayCollection.reduce(ee.Reducer.sum()).rename('total_biomass');
            
            //Mask the `totalBiomass` image to limit it to the region
            totalBiomass = totalBiomass.updateMask(totalBiomass.clip(region).mask());
          
          
          //Set visualization parameters and display the final cumulative biomass
          var visParams = {
            min: 1,
            max: 10,  // Adjust based on expected biomass range
            palette: ['blue', 'green', 'yellow', 'orange', 'red']
          };
          
          
          // Filter agera5_ic for temperature data in the specified date range
          var filtered_agera5_ic_temperature = agera5_ic
            .filterDate(start, end)
            .select('Temperature_Air_2m_Mean_24h');

          //Extract mean daily temperature values in Celsius for each image with null handling
          var temperatureValues = filtered_agera5_ic_temperature.map(function(image) {
            var meanTemperature = image.reduceRegion({
              reducer: ee.Reducer.mean(),
              geometry: bufferedRegion,
              scale: 10000,  // Match the resolution of AgERA5 data (10 km)
              maxPixels: 1e9
            }).get('Temperature_Air_2m_Mean_24h');

            // Set temperature to 0 if it’s null, otherwise convert to Celsius
            var meanTemperatureC = ee.Algorithms.If(
            meanTemperature,                    
            ee.Number(meanTemperature).subtract(273.15), // convert from Kelvin to Celsius
            0                                         
            );

          // Return image with mean daily temperature property
          return image.set('mean_temperature_C', meanTemperatureC)
                .set('system:time_start', image.get('system:time_start')); // Preserve timestamp
          });
          
          // Collect the transformed temperature values into a list, ordered by time
          var temperatureValuesList = temperatureValues.aggregate_array('mean_temperature_C');

          //Filter valid values within the range of 0 to 40
          var validTemperatureValues = temperatureValuesList.filter(ee.Filter.and(
            ee.Filter.gte('item', 0),
            ee.Filter.lte('item', 40)
          ));
          
          //Compute the mean of valid temperatures
          var meanValidTemperature = validTemperatureValues.reduce(ee.Reducer.mean());

          //Replace out-of-range values with the mean
          var adjustedTemperatureValuesList = temperatureValuesList.map(function(temp) {
            return ee.Algorithms.If(
              ee.Number(temp).gte(0).and(ee.Number(temp).lte(40)),
              temp, // Keep valid values
              meanValidTemperature // Replace invalid values with the mean
            );
          });
          
          // creating a feature collection in order to download the data into the computer locally as CSV
          var biomassData = ee.FeatureCollection(ee.List.sequence(0, biomassDates.length().subtract(1)).map(function(i) {
            return ee.Feature(null, {
              'Date': biomassDates.get(i),
              'Biomass_Mean': biomassValues.get(i),
              'dd':adjustedTemperatureValuesList.get(i)
            });
          }));
            
          //Export the FeatureCollection as CSV
          Export.table.toDrive({
            collection: biomassData,
            description: 'Biomass_Per_Day_Averages',
            fileFormat: 'CSV'
          });

          // Use the adjusted list for further calculations
          var cumulativeTemperatureSum = ee.Array(adjustedTemperatureValuesList).reduce({
            reducer: ee.Reducer.sum(),
            axes: [0] // Sum along the array
          }).get([0]);

          // Conditional calculation based on cumulative sum range
          var transformedTemperature = ee.Algorithms.If(
            cumulativeTemperatureSum.gte(1430).and(cumulativeTemperatureSum.lte(2455)),
            cumulativeTemperatureSum.multiply(0.0005013581).subtract(0.7327649974),  // Apply formula if within range
            ee.Algorithms.If(
              cumulativeTemperatureSum.gt(2455),
              0.5,  // Use 0.5 if above 2455
              0  // Use 0 if below 1430
            )
          );

          // Check cumulativeTemperatureSum and display message if below 1500
          if (cumulativeTemperatureSum.lt(1430).getInfo()) {
            var warningMessage = ui.Label({
              value: 'No Grain developed yet',
              style: {
                position: 'middle-right',
                padding: '8px',
                backgroundColor: 'rgba(255, 0, 0, 0.6)',
                fontSize: '14px',
                color: 'white'
              }
            });
  
          mapPanel.add(warningMessage);
          }
          
        // Convert transformedTemperature to an image for pixel-wise multiplication
        var transformedTemperatureImage = ee.Image.constant(transformedTemperature);

        // Create totalGrainWeight by multiplying totalBiomass by transformedTemperatureImage
        var totalGrainWeight = totalBiomass.multiply(transformedTemperatureImage).rename('total_grain_weight');

        // Mask totalGrainWeight to the region
        totalGrainWeight = totalGrainWeight.updateMask(totalGrainWeight.clip(region).mask());

        // Set visualization parameters for totalGrainWeight
        var grainWeightVisParams = {
          min: 1,
          max: 10,  // Adjust based on expected grain weight range
          palette: ['blue', 'green', 'yellow', 'orange', 'red']
        };

        // Calculate the average of all pixels in the layer
        var meanGrainWeight = totalGrainWeight.reduceRegion({
          reducer: ee.Reducer.mean(),
          geometry: region,
          scale: 10,  // Adjust to the resolution of your data
          maxPixels: 1e9
        }).get('total_grain_weight'); // Use the actual band name

        // Format the mean value to two decimal places and print it
        var formattedMeanGrainWeight = ee.Number(meanGrainWeight).format('%.2f');

        // Format the "end" date as text
        var formattedEndDate = end.format('YYYY-MM-dd').getInfo();  // Convert to string

        // Create a label displaying the final simulation date
        var endDateLabel = ui.Label({
          value: 'Final simulation date: ' + formattedEndDate,
          style: {
              position: 'bottom-right',
              padding: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              fontSize: '12px'
          }
        });
        // Add the label to the map panel
        mapPanel.add(endDateLabel);
        //Add totalbove ground biomass
        mapPanel.addLayer(totalBiomass, visParams, 'Above Ground Biomass '+ formattedEndDate + ' Final day');
        // Add totalGrainWeight to the map for visualization
        mapPanel.addLayer(totalGrainWeight, grainWeightVisParams, 'Grain Weight '+ formattedEndDate + ' Final day');
        
        
        // Ensure totalBiomass and region are defined
        var totalBiomassUrl = totalBiomass.getDownloadURL({
          name: 'totalBiomass',
          region: region,
          scale: 10,
          format: 'GeoTIFF'
        });

        // Generate URL for totalGrainWeight
        var totalGrainWeightUrl = totalGrainWeight.getDownloadURL({
          name: 'totalGrainWeight',
          region: region,
          scale: 10,
          format: 'GeoTIFF'
        });
        // Generate URL for region shapefile as GeoJSON
        var regionUrl = ee.FeatureCollection([ee.Feature(region)]).getDownloadURL({
          format: 'SHP',
          filename: 'selected_region'
        });
        /////////////////////////////////////////////////////
        // Create a panel for the download links
        var downloadPanel = ui.Panel({
          layout: ui.Panel.Layout.flow('vertical'),
          style: {
            position: 'top-left',
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            fontSize: '12px',
            width: '250px'
          }
        });

        // Add title to the download panel
        downloadPanel.add(ui.Label('Download Links:', {fontWeight: 'bold'}));

        // Add download links to the panel with clickable labels
        downloadPanel.add(ui.Label({
          value: 'Download Above Ground Biomass (GeoTIFF) ' + formattedEndDate,
          targetUrl: totalBiomassUrl,
          style: {color: 'blue', textDecoration: 'underline'}
        }));
        downloadPanel.add(ui.Label({
          value: 'Download Grain Weight (GeoTIFF) '+ formattedEndDate,
          targetUrl: totalGrainWeightUrl,
          style: {color: 'blue', textDecoration: 'underline'}
        }));
        downloadPanel.add(ui.Label({
          value: 'Download Selected Region (Shapefile) '+ formattedEndDate,
          targetUrl: regionUrl,
          style: {color: 'blue', textDecoration: 'underline'}
        }));
        // Add the download panel to the main map panel
        mapPanel.add(downloadPanel);
        ////////////////////////////////////////////////
        // Inside onButtonClick function, after displaying totalBiomass and totalGrainWeight layers
        function addDownloadButton() {
        // Define the download function
          function downloadLayers() {
            Export.image.toDrive({
              image: totalBiomass,
              description: 'totalBiomass',
              folder: 'GEE_Downloads',
              fileNamePrefix: 'totalBiomass',
              region: region,
              scale: 10,
              maxPixels: 1e13
            });

            Export.image.toDrive({
              image: totalGrainWeight,
              description: 'totalGrainWeight',
              folder: 'GEE_Downloads',
              fileNamePrefix: 'totalGrainWeight',
              region: region,
              scale: 20,
              maxPixels: 1e13
            });
            // Export the region geometry as a GeoJSON
            Export.table.toDrive({
              collection: ee.FeatureCollection([ee.Feature(region)]),
              description: 'selected_region',
              folder: 'GEE_Downloads',
              fileNamePrefix: 'selected_region',
              fileFormat: 'SHP' 
            });
          print('Download tasks for totalBiomass and totalGrainWeight have been started. Check Google Drive.');
          }

          // Create the download button
          var downloadButton = ui.Button({
            label: 'Download Layers',
            onClick: downloadLayers,
            style: {width: '250px'}
          });

          // Add the download button to the control panel
          controlPanel.add(downloadButton);
        }
        // Call addDownloadButton function to add the button to the UI
        //addDownloadButton();
        });
    });
}
//////////////////// End of backend mechanistic model computation part

//////////////////// Start of backend empirical model part
function onPredictionButtonClick(){
  // Read the date of interest and sowing date from the input
  var dateOfInterest = ee.Date(dateOfInterestInput.getValue());
  var sowingDate = ee.Date(sowingDateInput.getValue());

  // Get the drawn geometries (polygons)
  var geometries = [];
  drawingTools.layers().forEach(function (layer) {
    var object = layer.getEeObject();
    if (object && (object instanceof ee.Geometry)) {
      geometries.push(object);
    }
  });

  if (geometries.length === 0) {
    print('No geometries drawn. Please draw a polygon on the map.');
    return;
  }
  
  var region = ee.Geometry.MultiPolygon(geometries);
  print('Selected Region for Prediction:', region);

  /// Define Sentinel-2 surface reflectance dataset and filter it based on time period cloud precentages
  var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterDate(sowingDate, dateOfInterest) // Filter by sowing date and date of interest
    .filterBounds(region)
    .map(function(image) {
        // Mask out non-clear pixels based on the SCL band
        var scl = image.select('SCL'); // Scene Classification Layer
        var clearPixels = scl.eq(4).or(scl.eq(5)); // 4: Vegetation, 5: Bare soil

        // Count the total pixels in the region
        var totalPixelCount = image.reduceRegion({
            reducer: ee.Reducer.count(),
            geometry: region,
            scale: 10, // Sentinel-2 resolution
            maxPixels: 1e9
        }).values().get(0);
        
        // Count the clear pixels in the region
        var clearPixelCount = image.updateMask(clearPixels)
            .reduceRegion({
                reducer: ee.Reducer.count(),
                geometry: region,
                scale: 10, // Sentinel-2 resolution
                maxPixels: 1e9
            }).values().get(0);

        // Add a property indicating if all pixels are clear
        var allPixelsClear = ee.Number(clearPixelCount).eq(ee.Number(totalPixelCount));
        return image.set('allPixelsClear', allPixelsClear);
    })
    .filter(ee.Filter.eq('allPixelsClear', 1));
  
  // Get the most recent image
  var latestImage = sentinel2.sort('system:time_start', false).first();
  
  //Extract the date of the latest image
  var latestImageDate = ee.Date(latestImage.get('system:time_start')).format('YYYY-MM-dd').getInfo();

  // Load the pre-trained Random Forest classifier
  var classifierAssetId = 'projects/pslchickpea/assets/trained_rf_yield_model';
  var savedClassifier = ee.Classifier.load(classifierAssetId);

  // Apply the classifier to the latest image
  var predictedYield = latestImage.classify(savedClassifier).rename('predicted_yield');

  // Calculate the average value of predicted yield for the region
  var meanPredictedYield = predictedYield.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: region,
    scale: 20, // Match Sentinel-2 resolution
    maxPixels: 1e9
  }).get('predicted_yield'); // Use the band name 'predicted_yield'

  // Format the mean value to two decimal places
  var formattedMeanPredictedYield = ee.Number(meanPredictedYield).format('%.2f');
  
  // Add a label displaying the forecast date to the map
  var forecastDateLabel = ui.Label({
    value: 'Forecast done from: ' + latestImageDate + ', Field Average: ' + formattedMeanPredictedYield.getInfo() + ' tons/ha',
    style: {
      position: 'bottom-right',
      padding: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      fontSize: '12px'
    }
  });
  mapPanel.add(forecastDateLabel);
  // Visualization parameters for the predicted yield
  var visParams = {
    min: 0,
    max: 10, // Adjust based on your data range
    palette: ['blue', 'green', 'yellow', 'orange', 'red']
  };
  
  // Add the predicted yield layer to the map, clipped to the region
  mapPanel.addLayer(predictedYield.clip(region), visParams, 'Predicted Chickpea Yield ' + latestImageDate);
  
  // Ensure predictedYield and region are defined
  var predictedYieldUrl = predictedYield.getDownloadURL({
    name: 'predictedYield',
    region: region,
    scale: 20, // Match Sentinel-2 resolution
    format: 'GeoTIFF'
  });
  
  // Generate URL for region shapefile as GeoJSON
  var regionUrl = ee.FeatureCollection([ee.Feature(region)]).getDownloadURL({
    format: 'SHP',
    filename: 'selected_region'
  });
  

  // Create a panel for the download link
  var downloadPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('vertical'),
      style: {
      position: 'top-left',
      padding: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      fontSize: '12px',
      width: '250px'
    }
  });

  // Add title to the download panel
  downloadPanel.add(ui.Label('Download Link:', {fontWeight: 'bold'}));

  // Add download link for the predicted yield layer
  downloadPanel.add(ui.Label({
    value: 'Download Predicted Yield (GeoTIFF) ' + latestImageDate, 
    targetUrl: predictedYieldUrl,
    style: {color: 'blue', textDecoration: 'underline'}
  }));
  
  // Add download link for the selected region shapefile
  downloadPanel.add(ui.Label({
    value: 'Download Selected Region (Shapefile)',
    targetUrl: regionUrl,
    style: {color: 'blue', textDecoration: 'underline'}
  }));

  // Add the download panel to the main map panel
  mapPanel.add(downloadPanel);
}
//////////////////// End of backend empirical model part
