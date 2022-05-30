let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 41.6303, lng: -73.3107 },
    zoom: 8,
  });
}

async function readFile(fileReadEvent) {
  let geojson = await loadShp(fileReadEvent.target.result)
  let layer = new google.maps.Data();
  let bounds = new google.maps.LatLngBounds();
  layer.addGeoJson(geojson);
  layer.setMap(map);
  layer.forEach((f) => f.getGeometry().forEachLatLng((latLng) => bounds.extend(latLng)));
  map.fitBounds(bounds);
}

function loadFile(fileInputEvent) {
  let reader = new FileReader();
  let file = fileInputEvent.target.files[0];
  reader.onload = readFile;
  reader.readAsArrayBuffer(file);
}

function loadShp(data) {
  return shp.parseZip(data);
}

window.loadFile = loadFile;
window.initMap = initMap;



