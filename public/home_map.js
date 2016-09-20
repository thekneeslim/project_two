document.addEventListener("DOMContentLoaded", function() {

  console.log("HELLO WORLD")

  var mymap = L.map('mapid', {
    center: [1.3, 103],
    zoom: 7
  });

  function drawMap(apple) {
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 7,
        zoomControl: false,
        id: apple,
        accessToken: 'pk.eyJ1IjoidGhla25lZXNsaW0iLCJhIjoiY2l0YjdmNDgzMDU4ajJubHFyaGc4ZTFwaSJ9.hgmQr058MoQktYgNL-m6iA'
    }).addTo(mymap);
  }

  $('#street').click(function() {
    var mymap = 'thekneeslim.1ei4nd08'
    drawMap(mymap)
  });

  $('#satelite').click(function() {
    var mymap = 'thekneeslim.1ehpah49'
    drawMap(mymap)
  });

  $('#dark').click(function() {
    var mymap = 'thekneeslim.1einhmc9'
    drawMap(mymap)
  });


// END OF DOM CONTENT LOADED
})
