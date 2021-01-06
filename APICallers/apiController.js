const smhi = require('./smhi');
const trafiklab = require('./TrafikLab');
const promise = require('promise')
const axios = require('axios')
const https = require('https')

function cacheData() {
    smhi.init()
}

function getData(lat, lng) {
    let data;
    console.log(lat, lng);
    let goal = smhi.getBestWeather(lat, lng);
    let coords = {start: {lat: parseFloat(lat), lng: parseFloat(lng)}, goal: {lat: goal.latitude, lng: goal.longitude}};
    console.log(coords)

    // temp hårdkodade värden
    let transport = [{lat: 55.551710, lng: 13.119042}, {lat: 55.479385, lng: 13.217444}]
    // let transport = xxx.xxx(lat: parseFloat(lat), lng: parseFloat(lng), lat: goal.latitude, lng: goal.longitude)
    // data = {start: {lat: parseFloat(lat), lng: parseFloat(lng)}, goal: {lat: goal.latitude, lng: goal.longitude}}
    data = {start: coords.start, goal: coords.goal, transport}
    console.log(data)
    return data;
    // return transport
}

function getCoords(cityName){
    const x = 0
    console.log(cityName)
    return axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName + '&region=se&key=AIzaSyA-2b37L9ktBGKwKoZ46ZWl3x6md9xiBSI')
    .then(response => {
        try {
            var data = getData(response.data.results[x].geometry.location.lat, response.data.results[x].geometry.location.lng); 
            console.log(data);
            return data;
        } catch(e){
            if (e instanceof TypeError) {
                return null;
        }
    }})
    .catch(error => console.log(error));
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

function runTrafikLab(startLat, startLon, destLat, destLon) {
    //trafiklab.getRoute(55.594034, 12.966149, 55.704933, 13.204917, trafikCallback);
    trafiklab.getRoute(startLat, startLon, destLat, destLon, trafikCallback)
}

function trafikCallback(data) {
    var i = 0;
    data.forEach(routeSegm => {
        var typ;
        if (routeSegm.type == null) {
            typ = 'gång'
        } else {
            typ = routeSegm.type;
        }
        console.log('Sträcka ' + ++i + ' från ' + routeSegm.startName + ' till ' + routeSegm.destName + ' av typ ' + typ )
        if (routeSegm.stops.length > 0) {
            console.log('Stopp:');
            routeSegm.stops.forEach(stop => {
                console.log('* ' + stop.name + ' (Long: ' + stop.lon + ' / Lat: ' + stop.lat + ')');
            })
        }
    })
}

module.exports= {cacheData, getData, getCoords, removeUmlaut, runTrafikLab}

