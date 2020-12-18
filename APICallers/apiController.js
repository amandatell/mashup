const smhi = require('./smhi');

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

module.exports= {cacheData, getData}
