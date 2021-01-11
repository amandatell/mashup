let map, infoWindow;
let finalData;
var markers = [];

$( document ).ready(function() {
  document.getElementById('resList').style.visibility = "hidden";
});

// Kallar på en centrerad karta med info-boxar från Google-Maps API:et
function initMap() {  
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 59.622689, lng: 14.429024 }, 
    zoom: 5,
  });
  infoWindow = new google.maps.InfoWindow();

  }

// Hanterar presentationen av resultatet för accordion-resvägen - Indata: results, Utdata: item{}
function showResults(results){
  clearAccordion();
  document.getElementById('divSubmit').style.display = "none";
  document.getElementById('resList').style.visibility = "visible";
  for(var i = 1; i < results.trafik.length -1; i++){

    let item = {};
    item.id = i;
    let leg = results.trafik[i];
    let stops = leg.stops.length;
    let startTime = "<b>" + leg.startTime.substring(0, 5) +  "</b>" + " - ";
    item.description = "Resa från <b>" + leg.startName + "</b>, till <b>" + leg.destName + "</b>";
    if(leg.type != null){
      item.type = leg.type;
    } else{
      item.type = "Inget angett färdsätt."
    }
    item.stops = stops ; 
    item.title = startTime  + leg.startName + " -> " + leg.destName;
    addItemToAccordion(item);
  }
}

// Rensar stoppen i resvägspresentationen 
function clearAccordion(){
  $('#accordion').html("");
}

// Presenterar ett stopp för resvägspresentationen på sidan
function addItemToAccordion(item){
  $('#accordion').append(
  `
  <div class="card-header" id="heading_${item.id}"  style="background-color:#ffffff;">
    <h5 class="mb-0"></h5>
    <button class="accordion-button collapsed" data-toggle="collapse" data-target="#collapse_${item.id}" 
      aria-expanded="false" aria-controls="collapse_${item.id}">${item.title}</button>
      </div>
      <div class="collapse" id="collapse_${item.id}" aria-labelledby="heading_${item.id}" 
      data-parent="#accordion" vertical-allign="middle">
        <div class="card-body"><p id= "cardBodyP">${item.description}
        <p><b>Färdsätt:</b> ${item.type} - <b>Antal stop: </b> ${item.stops}</p>
        
        </p></div>
  </div>
  `
    );
  }

  // Utförs vid en klick-EventListener för platstjänst-servicen.
  document.querySelector('.get_data').addEventListener("click", () => {
    // Testar HTML5 Geolocation för akutell position.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          // Hämtar data om aktuella platsen och kör markMap funktionen
          getData(pos);
          markMap();
          
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Errorhandling om platsen inte finns
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

// Errorhandling för platstjänsten, geolocation kontroll med meddelanden till användare baserat på felet
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);

}
// Initierar funktionerna och markeringarna på kartan med anropen till Google-API:er för en ny karta - Indata: finalData, Utdata: response
function markMap(){
  initMap();
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  markers.forEach(marker => marker.setMap(null));
  markers.length = 0;
  var startMarker = new google.maps.Marker({
    position: finalData.start
  });
  var goalMarker = new google.maps.Marker({
    position: finalData.goal,
    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
  });

  // Initierar och sätter samtliga variabler som krävs för Direction och Waypoint-API:et
  var origin = new google.maps.LatLng(finalData.start);
  var destination = new google.maps.LatLng(finalData.goal);
  var waypointsstop = []
  for (let i = 0; i < finalData.trafik.length ; i++) {
    var stops = new google.maps.LatLng({lat: finalData.trafik[i].destLat, lng: finalData.trafik[i].destLon})
    console.log(finalData.trafik[i])
    waypointsstop.push({
      location: stops,
      stopover: true,
    });
  }
  console.log(waypointsstop)
  directionsRenderer.setMap(map)
  var request = {
    origin: origin,
    destination: destination,
    travelMode: 'WALKING',
    waypoints: waypointsstop
  }
  // Skapar en rutt från start till slut med samtliga stopp som sedan presenteras på kartan
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      console.log("directions:", response)
      directionsRenderer.setDirections(response);
    }
  });
  
  //startMarker.setMap(map);
  markers.push(startMarker)
  //markers.setMap(map);
  markers.push(goalMarker);
  markers.forEach(marker => marker.setMap(map));
  infoWindow.open(map);
  let center = {lat: (finalData.start.lat + finalData.goal.lat) / 2, lng: (finalData.start.lng + finalData.goal.lng) / 2}
  console.log(center)
  map.setCenter(center);
  map.setZoom(10);
}

// Hämtar data från plats och kör markMap genom sökfunktionen vid klick
document.querySelector('.getPlace').addEventListener("click", () => {
  let place = $('#place').val();
  getDataPlace(place);
  markMap();  
});

// Läser/uppdaterar/skickar platstjänstdata efter samtliga argument uppfyllts. 
function getDataPlace(place){
  $.ajax({
    url: 'http://localhost:3000/?place=' + place,
    async: false,
    headers: {"Accept": "application/json"},
    error: function (request) {
      console.log(arguments)
      error(arguments);
  },
  })
  .done(function (data) { 
      finalData = data;
      console.log(finalData)
      showResults(finalData);
  });

}
// Läser/uppdaterar/skickar platstjänstdata med latitude & longitude värden efter samliga argument uppfyllts 
function getData(pos){
  $.ajax({
    url: 'http://localhost:3000/?lat= '+ pos.lat + '&lng=' + pos.lng,
    async: false,
    headers: {"Accept": "application/json"},
    error: function (request) {
      console.log(arguments)
      error(arguments);
    },
  })
  .done(function (data) { 
      finalData = data;
      console.log(finalData)
      showResults(finalData);
  });

}
// Argument hantering och errorhantering baserat på argumentet. 
function error(arguments){
  swal (JSON.stringify(arguments[0].responseJSON.statusCode), arguments[0].responseJSON.error ,  "error" )
}