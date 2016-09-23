document.addEventListener("DOMContentLoaded", function() {

  console.log("HELLO WORLD")


  var appID = '32c5ace3';
  var appKey = 'd6841c71671e28a21c520f886b634c2c'
  var mapType = 'thekneeslim.1einhmc9'
  // var coordinates = [35.9, 127.77];
  var planesLayer;
  var coordinates = [1.352, 103.820];
  var tempPlanes =[];
  var mymap = L.map('mapid', {
    center: coordinates,
    zoom: 7
  });

  // ON LOAD AND UPDATING PLANE MOVEMENTS
  drawMap(mapType);
  setTimeout(function() {
    drawPlanesRevised()
  }, 1000)
  setInterval(function() {
    console.log("I'm clearing!")
    mymap.removeLayer(planesLayer)
    console.log(coordinates)
    console.log("I'm drawing!")
    drawPlanesRevised();
  }, 5000);

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
    console.log('map location: ' + latitude + " - " + longitude)
  });

  // DRAWING OF PLANE & LIVE FEED
  var myIcon = L.icon({
  	iconUrl: '../img/plane.jpg',
  	iconRetinaUrl: '../img/plane.jpg',
  	iconSize: [30, 30],
  });

  // var planesLayer = new L.FeatureGroup();

  function drawPlanesRevised() {
//  ORIGINAL CODE
    planesLayer = new L.FeatureGroup();
    var url = 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flightsNear/' + coordinates[0] +'/' + coordinates[1] +'/200?appId=' + appID + '&appKey=' + appKey + '&maxFlights=50';
    // console.log("Draw Plane", coordinates)
    console.log(url)
    $.get(url).done(function(data) {
      console.log(data.flightPositions.length);
      console.log('data: ' + data);
      for(var i = 0; i < data.flightPositions.length; i++) {
        var longC = data.flightPositions[i].positions[0].lon;
        var latC = data.flightPositions[i].positions[0].lat;
        var callSign = data.flightPositions[i].callsign;
        var altitude = data.flightPositions[i].positions[0].altitudeFt;
        var speed = data.flightPositions[i].positions[0].speedMph
        var popContent = "Call Sign: " + callSign + "<br/>" +"Lon: " + longC + "<br/>" + "Lat: " + latC + "<br/>" + "Altitude: " + altitude + "<br/>" + "Speed: " + speed
        console.log(popContent)

        var x = L.marker([latC, longC], {icon: myIcon}, {className: i})
        var planeObject = new planeInfo(i, longC, latC, callSign, altitude, speed)
        console.log(planeObject);
        // x.bindPopup('<div class="trigger" id=i>Hello</div>')
        // .addTo(mymap);
        planesLayer.addLayer(x);
        // x._icon.id = planeObject.id
      }
      mymap.addLayer(planesLayer);
      // console.log(planesLayer)
    })

    // var longC = coordinates[1];
    // var latC = coordinates[0];
    // var callSign = 'callsign';
    // var altitude = 'altitudeFt';
    // var speed = 'speedMph';
    //
    // var x = L.marker([latC, longC], {icon: myIcon})
    //
    // planesLayer.addLayer(x);
    // coordinates[1] += 1
    // coordinates[0] += 1
    //
    // mymap.addLayer(planesLayer);

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

//  FUNCTION TO STORE PLANE DETAILS
function planeInfo(id, lon, lat, call, alt, spd) {
  this.id = id;
  this.longitude = lon;
  this.lattutide = lat;
  this.callSign = call;
  this.altitude = alt;
  this.speed = spd;
  this.describe = function() {
    var popContent = "Call Sign: " + this.callSign + "<br/>" +"Lon: " + this.longitude + "<br/>" + "Lat: " +   this.lattutide + "<br/>" + "Altitude: " + this.altitude + "<br/>" + "Speed: " + this.speed
    return popContent
  }
}


// FULL SCREEN
L.control.fullscreen().addTo(mymap);

  // END OF DOM CONTENT LOADED
})
