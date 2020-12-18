/*$(document).ready(function () {
    $.ajax({
      url: 'http://localhost:3000/',
      headers: {"Accept": "application/json"}
    })
    .done(function (data) { 
        console.log(data)
    });
  });*/

let map, infoWindow;
let endPos;
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
          var startMarker = new google.maps.Marker({
            position: pos,
            label: { color: '#ffffff', fontWeight: 'bold', fontSize: '12px', text: 'Du' }
          });
          
          // To add the marker to the map, call setMap();
          getData(pos);
          var goalMarker = new google.maps.Marker({
            position: endPos,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          });
          console.log(endPos)
          startMarker.setMap(map);
          goalMarker.setMap(map);
          //console.log(goalMarker)
          //infoWindow.setPosition(pos);
          //infoWindow.setPosition(endPos);
          //infoWindow.setContent("Plats hittad.");
          infoWindow.open(map);
          let center = {lat: (pos.lat + endPos.lat) / 2, lng: (pos.lng + endPos.lng) / 2}
          console.log(center)
          map.setCenter(center);
          //map.setCenter(endPos);
          map.setZoom(10);
          //postLatLng(pos);
          
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

function getData(pos){
  console.log(pos)
  $.ajax({
    url: 'http://localhost:3000/?lat= '+ pos.lat + '&lng=' + pos.lng,
    async: false,
    headers: {"Accept": "application/json"}
  })
  .done(function (data) { 
      data = JSON.parse(data);
      endPos = {lat: data.latitude, lng: data.longitude};

  });
  return endPos

}
/*function postLatLng(pos) {
  $.ajax({
    method: "POST",
    url:'http://localhost:3000/',
    data: JSON.stringify(pos),
    headers: {"Content-type": "application/json"}
  }) 
  .done(function (data) { 
    console.log(data)
  });
}*/