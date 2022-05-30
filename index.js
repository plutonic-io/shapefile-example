let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 41.6303, lng: -73.3107 },
    zoom: 8,
  });
}

window.initMap = initMap;
