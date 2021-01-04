const smhi = require('./smhi');
const trafiklab = require('./TrafikLab');
const promise = require('promise')
const axios = require('axios')
const https = require('https')
var routeData;

function cacheData() {
    smhi.init()
}

function getData(lat, lng) {
    let data;
    //console.log(lat, lng);
    let goal = smhi.getBestWeather(lat, lng);
    let coords = {start: {lat: parseFloat(lat), lng: parseFloat(lng)}, goal: {lat: goal.latitude, lng: goal.longitude}};
    //console.log(coords)

    // let transport = xxx.xxx(lat: parseFloat(lat), lng: parseFloat(lng), lat: goal.latitude, lng: goal.longitude)
    // data = {start: {lat: parseFloat(lat), lng: parseFloat(lng)}, goal: {lat: goal.latitude, lng: goal.longitude}}
    

    return trafiklab.getRoute(coords.start.lat, coords.start.lng, coords.goal.lat, coords.goal.lng).then(function(trafik) {
        if(trafik != null){
            data = {start: coords.start, goal: coords.goal, trafik}
        }

      return data;
      //console.log(trafik)
    });

    //console.log(data);
    //var trafik = await trafiklab.getRoute(transport[0].lat, transport[0].lng, transport[1].lat, transport[1].lng);
   
    // return transport
}

function getCoords(cityName){
    const x = 0
    //console.log(cityName)
    return axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName + '&key=AIzaSyA-2b37L9ktBGKwKoZ46ZWl3x6md9xiBSI')
    .then(response => {
        //console.log("RESPONSE: ")
        //console.log(response)
        if(response.data.results != null){
            try {
                var data = getData(response.data.results[x].geometry.location.lat, response.data.results[x].geometry.location.lng); 
                console.log(data);
                return data;
            } catch(e){
                if (e instanceof TypeError) {
                    
                    return "locNotFound";
                }
            }
        } else{
            console.log("HEJSAN!")
        }
    })
    .catch(error => console.log(error + "ASDASD------------------------------------------------------------------------------------------------------------------ASDASD"));
}

function removeUmlaut(placeName){
    var place = "";
    for(let i = 0; i < placeName.length; i++){
      let temp;
      if(placeName[i] === 'å' ||  i === 'å')
        temp = 'a';
      else if(placeName[i] === 'ö')
        temp = 'o';
      else
        temp = placeName[i];
      place += temp;
    }  
    return place;
}

module.exports= {cacheData, getData, getCoords, removeUmlaut}

