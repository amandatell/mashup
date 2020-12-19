const smhi = require('./smhi');
const TrafikLab = require ('./TrafikLab')
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
    return axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName + '&key=AIzaSyA-2b37L9ktBGKwKoZ46ZWl3x6md9xiBSI')
    .then(response => {
        try {
            var data = getData(response.data.results[x].geometry.location.lat, response.data.results[x].geometry.location.lng); 
            return data;
        } catch(e){
            if (e instanceof TypeError) {
                return null;
        }
    }})
    .catch(error => console.log(error));
}

module.exports= {cacheData, getData, getCoords}
