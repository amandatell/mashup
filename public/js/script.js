$(document).ready(function () {
    $.ajax({
      url: 'http://localhost:3000/',
      headers: {"Accept": "application/json"}
    })
    .done(function (data) { 
        console.log(data)
    });
});

let map;

function initMap() {
  console.log("Karta")
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 55.893180, lng: 13.582728  }, 
    zoom: 8,
  });
}