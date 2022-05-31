let map;
let infowindow;
let layer;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 41.6303, lng: -73.3107 },
    zoom: 8,
  });
}
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

function loadShp(files) {
  return new Promise(function (resolve, reject) {
    let readers = [];
    for (let i = 0; i < files.length; i++) {
      readers.push(readFileAsArrayBuffer(files[i]));
    }
    Promise.all(readers).then(async (buffers) => {
      let geojson;
      if (buffers.length > 1) {
        const enc = new TextDecoder("utf-8");
        geojson = await shp.combine([
          shp.parseShp(
            buffers.find((b) => b.name.endsWith(".shp")).arrayBuffer,
            enc.decode(buffers.find((b) => b.name.endsWith(".prj")).arrayBuffer)
          ),
          shp.parseDbf(
            buffers.find((b) => b.name.endsWith(".dbf")).arrayBuffer
          ),
        ]);
      } else if (buffers.find((b) => b.name.endsWith(".zip"))) {
        geojson = await shp.parseZip(
          buffers.find((b) => b.name.endsWith(".zip")).arrayBuffer
        );
      } else {
        reject('No valid files.')
      }
      resolve(geojson);
    });
  });
}

window.loadShp = loadShp;
window.addLayer = addLayer;
window.initMap = initMap;
