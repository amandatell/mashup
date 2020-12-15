$(document).ready(function () {
    $.ajax({
      url: 'http://localhost:3000/',
      headers: {"Accept": "application/json"}
    })
    .done(function (data) { 
        console.log(data)
    });
  });

let map, infoWindow;

/// JUST NU HÄMTAR "GET_DATA" PLATSTJÄNST
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 55.893180, lng: 13.582728 }, 
    zoom: 8,
  });
  infoWindow = new google.maps.InfoWindow();
  //const locationButton = document.createElement("button");
  //locationButton.textContent = "Hämta din plats";
  //locationButton.classList.add("custom-map-control-button");
  //get_data.classList.add("custom-map-control-button");
  //map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  document.querySelector('.get_data').addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          var marker = new google.maps.Marker({
            position: pos,
            label: { color: '#ffffff', fontWeight: 'bold', fontSize: '8px', text: 'Start' }
        });
        
          // To add the marker to the map, call setMap();
          marker.setMap(map);
          //infoWindow.setPosition(pos);
          //infoWindow.setContent("Plats hittad.");
          infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(10);
          postLatLng(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);

}

function postLatLng(pos) {
  $.ajax({
    method: "POST",
    url:'http://localhost:3000/',
    data: JSON.stringify(pos),
    headers: {"Content-type": "application/json"}
  }) 
  .done(function (data) { 
    console.log(data)
  });
}