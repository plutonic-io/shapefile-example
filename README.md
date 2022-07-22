# shapefile-example
Example shapefile upload and visualize on Google Maps v3 API.

To install dependencies run `npm install`
To run the development server run `node app.js`
App will then be visible at http://localhost:3000/

## Background

This example is built atop Calvin Metcalf's excellent [shpjs npm package](https://github.com/calvinmetcalf/shapefile-js#readme). Here it is included inline using the latest verstion hosted from unpkg.com, but any production deployment should pin to a fixed version vendored into the app. 

## Usage 

Inside the `index.js` file are three functions that accomplish the bulk of the functionality. First is a `loadShp` function that accepts a `FileList` object returned from a file input HTML control. Tie that function to the input control's `onchange` event, and resolve the `Promise<FeatureCollection>` it returns to whatever function is to accept the resulting GeoJSON, as well as any error handling you want to implement. Note that this function requires the `readAsArrayBuffer` helper function, which resolves the `FileList` parameter to a list of `ArrayBuffer` the shapefile processing library can consume.

## License

Copyright 2022 Jeremy Malczyk

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   [https://www.apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. 




