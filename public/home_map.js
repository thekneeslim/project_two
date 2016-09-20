document.addEventListener("DOMContentLoaded", function() {

  console.log("HELLO WORLD")

  var mapType = 'thekneeslim.1ei4nd08'

  var mymap = L.map('mapid', {
    center: [1.3, 103],
    zoom: 7
  });

  drawMap(mapType);

  function drawMap(apple) {
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 7,
        minZoom: 7,
        zoomControl: false,
        id: apple,
        accessToken: 'pk.eyJ1IjoidGhla25lZXNsaW0iLCJhIjoiY2l0YjdmNDgzMDU4ajJubHFyaGc4ZTFwaSJ9.hgmQr058MoQktYgNL-m6iA'
    }).addTo(mymap);
  }

  $('#street').click(function() {
    mapType = 'thekneeslim.1ei4nd08'
    drawMap(mapType)
  });

  $('#satelite').click(function() {
    mapType = 'thekneeslim.1ehpah49'
    drawMap(mapType)
  });

  $('#dark').click(function() {
    mapType = 'thekneeslim.1einhmc9'
    drawMap(mapType)
  });

// END OF DOM CONTENT LOADED
})
