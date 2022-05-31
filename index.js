
/**
 * 
 * Basic example using the shapefile-js package to load shapefiles
 * in memory and add features to a Google Maps v3 map. See the docs
 * at https://github.com/calvinmetcalf/shapefile-js for more information.
 * 
 */

// Globals for the Google Map.
let map; 
let infowindow;
let layer;

/** 
 * Initialize the Google map
 */
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 41.6303, lng: -73.3107 },
    zoom: 8,
  });
}

/**
 * Adds a GeoJSON google.maps.Data layer and binds an infowindow to 
 * feature click events.
 * 
 * @param {FeatureCollection} geojson 
 * 
 */
function addLayer(geojson) {
  let bounds = new google.maps.LatLngBounds();
  if (infowindow) {
    infowindow.close();
  } else {
    infowindow = new google.maps.InfoWindow();
  }
  if (layer) {
    layer.setMap(null);
  }
  layer = new google.maps.Data();

  infowindow.close();
  layer.setStyle({ strokeWeight: 1, fillOpacity: 0 });
  layer.addListener("click", function (f) {
    infowindow.close();
    let content = "<div>";
    f.feature.forEachProperty((val, key) => {
      content += `<div>
                    <strong class='infokey'>${key}</strong>
                    <span class='infoval'>${val}</span>
                  </div>`;
    });
    content += "</div>";
    infowindow.setContent(content);
    infowindow.open({
      anchor: new google.maps.Marker({
        position: f.latLng,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0,
        },
      }),
      map: map,
      shouldFocus: true,
    });

    console.log(f);
  });
  layer.addGeoJson(geojson);
  layer.setMap(map);
  layer.forEach((f) =>
    f.getGeometry().forEachLatLng((latLng) => bounds.extend(latLng))
  );
  map.fitBounds(bounds);
}

/** 
 * Helper function to read files into ArrayBuffers 
 * 
 * @param {FeatureCollection} geojson 
 * 
 * @returns Promise<{name:str, arrayBuffer:ArrayBuffer}> 
 * 
 */
function readFileAsArrayBuffer(file) {
  return new Promise(function (resolve, reject) {
    let fr = new FileReader();

    fr.onload = function () {
      resolve({ name: file.name, arrayBuffer: fr.result });
    };

    fr.onerror = function () {
      reject(fr);
    };

    fr.readAsArrayBuffer(file);
  });
}
/**
 * Load a shapefile from a list of files or single zip archive. Loads 
 * what it can from what is provided, and reprojects to WGS84 is a .prj 
 * file is present in the FileList. Returns a Promise that resolves to a 
 * GeoJSON FeatureCollection, with properties from the .dbf file, if it
 * was included in the list or zip archive. 
 * 
 * @param {FileList} files Files selected via a file input form control.
 * 
 * @returns Promise<FeatureCollection>
 */
function loadShp(files) {
  return new Promise(function (resolve, reject) {
    let readers = [];
    for (let i = 0; i < files.length; i++) {
      readers.push(readFileAsArrayBuffer(files[i]));
    }
    Promise.all(readers).then(async (buffers) => {
      let geojson, geomArray;
      if (buffers.length > 1) {
        const enc = new TextDecoder("utf-8"),
          projBuffer = buffers.find((b) => b.name.endsWith(".prj")),
          proj = projBuffer ? enc.decode(projBuffer.arrayBuffer) : null,
          dbfBuffer = buffers.find((b) => b.name.endsWith(".dbf")),
          dbf = dbfBuffer ? dbfBuffer.arrayBuffer : null;

        if (dbf && proj) {
          geojson = await shp.combine([
            shp.parseShp(
              buffers.find((b) => b.name.endsWith(".shp")).arrayBuffer,
              proj
            ),
            shp.parseDbf(dbf),
          ]);
        } else if (dbf) {
          console.warn("Warning: No coordinate reference system provided.");
          geojson = await shp.combine([
            shp.parseShp(
              buffers.find((b) => b.name.endsWith(".shp")).arrayBuffer
            ),
            shp.parseDbf(dbf),
          ]);
        } else if (proj) {
          console.warn("Warning: No attribute information provided.");
          geomArray = await shp.parseShp(
            buffers.find((b) => b.name.endsWith(".shp")).arrayBuffer,
            proj
          );
        } else if (buffers.find((b) => b.name.endsWith(".shp"))) {
          console.warn(
            "Warning: No attribute information or coordinate reference system provided."
          );
          geomArray = await shp.parseShp(
            buffers.find((b) => b.name.endsWith(".shp")).arrayBuffer
          );
        } else {
          reject("No shp file found.");
        }
      } else if (buffers[0].name.endsWith(".zip")) {
        geojson = await shp.parseZip(buffers[0].readFileAsArrayBuffer);
      } else if (buffers[0].name.endsWith(".shp")) {
        console.warn(
          "Warning: No attribute information or coordinate reference system provided."
        );
        geomArray = await shp.parseShp(buffers[0].arrayBuffer);
      } else {
        reject("No shp file found.");
      }
      geojson = geojson || {
        type: "FeatureCollection",
        features: geomArray.map((g) => {
          return { type: "Feature", geometry: g, properties: {} };
        }),
      };
      resolve(geojson);
    });
  });
}

window.loadShp = loadShp;
window.addLayer = addLayer;
window.initMap = initMap;
