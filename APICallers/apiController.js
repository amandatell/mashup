const smhi = require('./smhi');
const trafiklab = require('./TrafikLab');
const promise = require('promise')
const axios = require('axios')
const https = require('https')
var routeData;

function cacheData() {
    smhi.init()
}

/* getData 
  Indata: koordinater (startpunkt)
  Utdata: JSON objekt med all data till index.js
*/
function getData(lat, lng) {
    let data;
    // Hämtar det bästa vädret inom radie av koordinaterna
    let goal = smhi.getBestWeather(lat, lng);
    let coords = {start: {lat: parseFloat(lat), lng: parseFloat(lng)}, goal: {lat: goal.latitude, lng: goal.longitude}};
    // Hämtar kollektivtrafik från TrafikcLab med hjälp av startpunkt och slutpunkt
    // Väntar med att returnera tills dess att all data är hämtad, dvs promise
    return trafiklab.getRoute(coords.start.lat, coords.start.lng, coords.goal.lat, coords.goal.lng).then(function(trafik) {
        if(trafik != null){
            data = {start: coords.start, goal: coords.goal, trafik}
        }

      return data;
    });
}

/*
  Funktionen omvandlar en plats till koordinater med hjälp av Google Geocode API
  Kallar sedan på getData och returnerar JSON-objekt till index.js med all data
  Indata: Plats
  Utdata:
*/
function getCoords(cityName){
    const x = 0
    // Gör anropet med hjälp av Axios, promise-baserad HTTP-klient
    return axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName + '&region=se&components=country:SE&key=AIzaSyA-2b37L9ktBGKwKoZ46ZWl3x6md9xiBSI')
    .then(response => {
        if(response.data.results != null){
            try {
                var data = getData(response.data.results[x].geometry.location.lat, response.data.results[x].geometry.location.lng);
                return data;
            } catch(e){
                // Ifall platsen inte hittades
                if (e instanceof TypeError) {
                    return "locNotFound";
                }
            }
        }
      })
    // Ifall ingen kollektivtrafik hittades
    .catch(error => { 
        return null
    });
}

/*
  Funktionen tar bort åäö från platsnamnet för att kunna skickas till Googles API
  Indata: plats
  Utdata: plats utan åäö
*/
function removeUmlaut(placeName){
    var place = "";
    for(let i = 0; i < placeName.length; i++){
      let temp;
      if(placeName[i] === 'å' ||  i === 'å')
        temp = 'a';
        else if(placeName[i] === 'ä' ||  i === 'ä')
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
