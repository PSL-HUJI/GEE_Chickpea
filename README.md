# Google Earth Engine Project

## Overview
This project contains a Google Earth Engine (GEE) script to serve as an example to create a field crops app that will:
1. Mechanistically model growth (above ground biomass and grain weight) using Sentinel-2 satellite data and AgERA5 climate data implementing simple conservative relationships. 
2. Empirical forecasting Grain Yield using GEE empirical random forest model.
   
#### Notes
The mechanistic model relies on the availability of Sentinel-2 clear imagery and AgERA5 data on GEE. While Sentinel-2 is updated almost in real-time, AgERA5 data has a delay of approximately seven days. The forecast model relies on the availability of Sentinel-2 clear imagery.

### Main Features in Function 1:
1. Compute LAI (Leaf Area Index) layers based on Sentinel-2 NDVI. [for example](https://brill.com/edcollchap/book/9789086869473/BP000021.xml).
2. Linearily interpolate daily LAI layers between sowing to the latest Sentinel-2 LAI layer.
3. Based on LAI pixel values in each layer, compute the fraction of solar intercepted radiation using the formula $1-exp(-0.5*LAI)$ 
4. Computes daily produced biomass and cumulative biomass using the formula.
5. Incorporates AgERA5 solar radiation and temperature for modeling above-ground biomass and yield using radiation use efficiency and harvest index.
6. Present the two layers - above-ground biomass and grain weight on the map with the final simulation date.

### Main Features in Function 2:
1. Uploading a saved random forest model trained on GEE using Sentinel-2 nine bands and pixel level yield data.
2. Uses this RF model to forecast chickpea grain yield based on the last available clear Sentinel-2 imagery.
3. Present forecast layer - with the date from which it was computed.

### How to Use the mechanistic model for your crop
1. Open the [Google Earth Engine Code Editor](https://code.earthengine.google.com/).
2. Copy the contents of `GEE_main_app_script.js`.
3. Paste it into the GEE Code Editor.
4. Change radiation use efficiency and harvest index relationship to cumulative degree days (locations are mentioned inside the script). 
5. Run the script and examine if an app interface is appearing on the main panel.
6. Run the model by pressing the button "Model AGB and GW".

#### Notes
**The provided scripts tested on chickpea data**<br>
**The `GEE_main_app_script.js` includes radiation use efficiency, LAI Sentinel-2 NDVI based and harvest index that calibrated on chickpea**<br>
You may change simulation-stopping rules. Currently, it will search increase above LAI of 2 and decrease to below 2 afterward, if it does not find an increase above 2 it will take the most recent Sentinel-2 clear imagery. 

### How to Use the empirical RF model for your crop
#### First stage - train RF empirical model on GEE using yield data and Sentinel-2 band reflectance 
1. Open the [Google Earth Engine Code Editor](https://code.earthengine.google.com/).
2. Upload your yield data as an asset (shapefile format).
3. Train random forest model - Sentinel-2 bands as predictors and yield as outcome (example in file `GEE_train_rf_model_yield_data.js`). 
4. Save the model as an asset.
#### Second stage - load the model in the main app script and use it on the last available Sentinel-2 imagery 
1. Load the model within the main app script (by copy the path to model asset location).
2. Run the script and draw a polygon on the map to define your region of interest (as done for the mechanistic model). 
3. Run the forecast by pressing the button "Forecast GY".
   
### Requirements
- Google Earth Engine account.
- Calibrated parameters for the mechanistic model  - radiation use efficiency and harvest index relationship to cumulative degree days
- Sub-field yield data for the forecast model - sub-field yield data, mostly acquired from combine harvesters, already cleaned and averaged to Sentinel-2 pixels. 

### Example Output
- Mechanistic model - Above-ground biomass and grain weight layers: `ton/ha`, at final simulation date. 
- Forecast model - grain yield estimation layer:`ton/ha`.
