document.addEventListener("DOMContentLoaded", function() {

  console.log("HELLO WORLD")


  var appID = '2921c0e6';
  var appKey = '55929833d05ffa98eb056fe2e30db505'
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
  }, 7000);

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
    console.log("Im in draw Planes Revised");
    // //  ORIGINAL CODE
    // planesLayer = new L.FeatureGroup();
    // var url = 'https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flightsNear/' + coordinates[0] +'/' + coordinates[1] +'/200?appId=' + appID + '&appKey=' + appKey + '&maxFlights=50/?callback=drawPlanesRevised';
    // // console.log("Draw Plane", coordinates)
    // console.log(url)
    // $.get(
    //     url
    //     // dataType: "jsonp",
    //   ).done(function(data) {
    //   console.log(data.flightPositions.length);
    //   console.log('data: ' + data);
    //   for(var i = 0; i < data.flightPositions.length; i++) {
    //     var longC = data.flightPositions[i].positions[0].lon;
    //     var latC = data.flightPositions[i].positions[0].lat;
    //     var callSign = data.flightPositions[i].callsign;
    //     var altitude = data.flightPositions[i].positions[0].altitudeFt;
    //     var speed = data.flightPositions[i].positions[0].speedMph
    //     var popContent = "Call Sign: " + callSign + "<br/>" +"Lon: " + longC + "<br/>" + "Lat: " + latC + "<br/>" + "Altitude: " + altitude + "<br/>" + "Speed: " + speed
    //
    //     var x = L.marker([latC, longC], {icon: myIcon})
    //
    //     x.bindPopup(popContent.toString())
    //
    //     planesLayer.addLayer(x);
    //   }
    //   mymap.addLayer(planesLayer);
    // })

    // AMENDED CODE
    planesLayer = new L.FeatureGroup();
    var url = 'https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flightsNear/' + coordinates[0] +'/' + coordinates[1] +'/200?appId=' + appID + '&appKey=' + appKey + '&maxFlights=50';
    console.log(url);
    $.ajax({
       url: url,
       dataType: 'jsonp',
       method: 'GET',
       success: function (data) {
         console.log("IM BACK");
         console.log(data);
         drawingPlanesFromAjax(data);
       }
     });
  }

  function drawingPlanesFromAjax(data) {
    console.log("IM IN DRAWING PLANES FROM AJAX");
    console.log(data.flightPositions.length);
    console.log('data: ' + data);
    for(var i = 0; i < data.flightPositions.length; i++) {
      var longC = data.flightPositions[i].positions[0].lon;
      var latC = data.flightPositions[i].positions[0].lat;
      var callSign = data.flightPositions[i].callsign;
      var altitude = data.flightPositions[i].positions[0].altitudeFt;
      var speed = data.flightPositions[i].positions[0].speedMph
      var popContent = "Call Sign: " + callSign + "<br/>" +"Lon: " + longC + "<br/>" + "Lat: " + latC + "<br/>" + "Altitude: " + altitude + "<br/>" + "Speed: " + speed

      var x = L.marker([latC, longC], {icon: myIcon})

      x.bindPopup(popContent.toString())

      planesLayer.addLayer(x);
    }
    mymap.addLayer(planesLayer);
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
        url: '/login/home/countryinfo',
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
      url: '/login/home',
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
        url: '/login/home/idinfo',
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
L.control.fullscreen().addTo(mymap);

  // END OF DOM CONTENT LOADED
})
