document.addEventListener("DOMContentLoaded", function() {

  console.log("HELLO WORLD")

  var mapType = 'thekneeslim.1einhmc9'
  var coordinates = [1.352, 103.820];
  var tempPlanes =[];
  var mymap = L.map('mapid', {
    center: coordinates,
    zoom: 7
  });

  // ON LOAD AND UPDATING PLANE MOVEMENTS
  drawMap(mapType);
  // setInterval(function() {
  //   console.log("I'm clearing!")
  //   mymap.removeLayer(planesLayer)
  //   console.log("I'm drawing!")
  //   drawPlanesRevised();
  // }, 6000);

  // DRAWING MAP
  function drawMap(apple) {
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 13,
      minZoom: 4,
      zoomControl: false,
      id: apple,
      accessToken: 'pk.eyJ1IjoidGhla25lZXNsaW0iLCJhIjoiY2l0YjdmNDgzMDU4ajJubHFyaGc4ZTFwaSJ9.hgmQr058MoQktYgNL-m6iA'

    }).addTo(mymap);
  }

  // COORDINATES OF CLICK
  mymap.on('click', function(e) {
    var latitude = e.latlng.lat;
    var longitude = e.latlng.lng;
    console.log(latitude + " - " + longitude)
  });

  // DRAWING OF PLANE & LIVE FEED
  var myIcon = L.icon({
  	iconUrl: '../img/plane.jpg',
  	iconRetinaUrl: '../img/plane.jpg',
  	iconSize: [30, 30],
  });

  var planesLayer = new L.FeatureGroup();

  function drawPlanesRevised() {
    var url = 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flightsNear/' + coordinates[0] +'/' + coordinates[1] +'/200?appId=1dc95c64&appKey=1e318ae140b09b5a47e0e28237579170&maxFlights=2';
    console.log("Draw Plane", coordinates)
    console.log(url)
    $.get(url).done(function(data) {
      console.log(data.flightPositions.length);

      for(var i = 0; i < data.flightPositions.length; i++) {
        var longC = data.flightPositions[i].positions[0].lon;
        var latC = data.flightPositions[i].positions[0].lat;
        var callSign = data.flightPositions[i].callsign;
        var altitude = data.flightPositions[i].positions[0].altitudeFt;
        var speed = data.flightPositions[i].positions[0].speedMph

        var x = L.marker([latC, longC], {icon: myIcon})

        planesLayer.addLayer(x);
      }
      mymap.addLayer(planesLayer);
    })
  }

  // CHANGING MAPS
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

  // SEARCH BY FAVOURITES
  $('#favSearch').submit(function(e) {
    e.preventDefault();

    var country = $('#favSelected').val()
    console.log(country)

    getCountrySelectedInfo(country)

    function getCountrySelectedInfo(apple) {
      $.ajax({
        url: 'http://localhost:3000/login/home/countryinfo',
        type: 'POST',
        data: {countryName: apple}
      }).done(function (data) {
        coordinates = [data.latitude, data.longitude];
        mymap.setView(coordinates, 7);
        drawMap(mapType)
      })
    }
  })

  // SEARCH BY COORDINATES
  $('#corSearch').submit(function(e) {
    e.preventDefault();
    var latitude = $('#latitude').val()
    var longitude = $('#longitude').val()
    coordinates = [latitude,longitude];

    $.ajax({
      url: 'http://localhost:3000/login/home',
      type: 'GET'
    }).done(function (data) {
      mymap.setView(coordinates, 7);
      drawMap(mapType)
    })
  })

  // SEARCH BY COUNTRIES
  $('#countrySearch').submit(function(e) {
    e.preventDefault();

    var countryID = $('#countrySelected').val()
    console.log(countryID)

    getCountrySelectedInfo(countryID)

    function getCountrySelectedInfo(apple) {
      $.ajax({
        url: 'http://localhost:3000/login/home/idinfo',
        type: 'POST',
        data: {id: apple}
      }).done(function (data) {
        coordinates = [data.latitude, data.longitude];
        mymap.setView(coordinates, 7);
        drawMap(mapType)
      })
    }
  })

// FULL SCREEN


  // END OF DOM CONTENT LOADED
})
