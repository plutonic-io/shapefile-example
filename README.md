# shapefile-example
Example shapefile upload and visualize on Google Maps v3 API.

To install dependencies run `npm install`
To run the development server run `node app.js`
App will then be visible at http://localhost:3000/

## Background

This example is built atop Calvin Metcalf's excellent [shpjs npm package](https://github.com/calvinmetcalf/shapefile-js#readme). Here it is included inline using the latest verstion hosted from unpkg.com, but any production deployment should pin to a fixed version vendored into the app. 

## Usage 

Inside the `index.js` file are three functions that accomplish the bulk of the functionality. First is a `loadShp` function that accepts a `FileList` object returned from a file input HTML control. Tie that function to the input control's `onchange` event, and resolve the promose it returns to whatever function is to accept the resulting GeoJSON FeatureCollection, as well as any error handling you need to implement. Note that this function requires the `readAsArrayBuffer` helper function, which resolves the `FileList` to a list of `ArrayBuffer` the shapefile processing library can consume.




