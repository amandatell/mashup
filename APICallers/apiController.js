const smhi = require('./smhi');
const trafiklab = require('./TrafikLab');

function cacheData() {
    smhi.init()
}

function getData(lat, lng) {
    let json;
    console.log(lat, lng);
    let goal = smhi.getBestWeather(lat, lng);
    let coords = {start: {lat: parseFloat(lat), lng: parseFloat(lng)}, goal: {lat: goal.latitude, lng: goal.longitude}};
    console.log(coords)


    // let transport = xxx.xxx(coords)
    return goal;
    // return transport
}