let map, infoWindow;
let finalData;
/// JUST NU HÄMTAR "GET_DATA" PLATSTJÄNST

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 55.893180, lng: 13.582728 }, 
    zoom: 8,
  });
  infoWindow = new google.maps.InfoWindow();

  

  document.getElementById('test').addEventListener("click", () => {
    showResults();
  })

  document.getElementById('test2').addEventListener("click", () => {
    removeResults();
  })

  document.getElementById('resList').style.visibility = "hidden";

  function showResults(results){
    document.getElementById('divSubmit').style.display = "none";
    document.getElementById('resList').style.visibility = "visible";
    for(var i = 0; i < 6; i++){
      let item = {};
      item.id = i;
      item.description = "Från Malmö C Plattform A till Vellinge C plattform B";
      item.title = "Malmö -> Vellinge";
      addItemToAccordion(item);
    }
    
  }

  function removeResults(){
    document.getElementById('divSubmit').style.display = "block";
    document.getElementById('resList').style.visibility = "hidden";
  }

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
          <div class="card-body"><p id= "cardBodyP">${item.description}</p></div>
    </div>
    `
    );
    /*
    $('#accordion').append(`
    <div class="collapse show" id="accItem_${item.id}" aria-labelledby="headingOne"  
    data-parent="#accordion" style="">
      <div class="card-body">
      </div> ${item.description} </div>
      <div class="card-header" id="headingOne"><h5 class="mb-0">
        </h5><button class="btn" data-toggle="collapse" data-target="#accItem_${item.id}" 
    aria-expanded="false" aria-controls="accItem${item.id}">${item.title}</button></div>`)

    */
  }


  document.querySelector('.get_data').addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          // To add the marker to the map, call setMap();
          getData(pos);
          console.log(finalData)
          var startMarker = new google.maps.Marker({
            position: finalData.start,
            label: { color: '#ffffff', fontWeight: 'bold', fontSize: '12px', text: 'Du' }
          });
          var goalMarker = new google.maps.Marker({
            position: finalData.goal,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          });
          startMarker.setMap(map);
          goalMarker.setMap(map);
          infoWindow.open(map);
          let center = {lat: (finalData.start.lat + finalData.goal.lat) / 2, lng: (finalData.start.lng + finalData.goal.lng) / 2}
          console.log(center)
          map.setCenter(center);
          map.setZoom(10);
          
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
  $.ajax({
    url: 'http://localhost:3000/?lat= '+ pos.lat + '&lng=' + pos.lng,
    async: false,
    headers: {"Accept": "application/json"}
  })
  .done(function (data) { 
      finalData = data;
  });

}