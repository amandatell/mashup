const smhi = require('./smhi');

function cacheData() {
    smhi.init()
}

function getData(lat, lng) {
    let json;
    console.log(lat, lng);
    let goal = smhi.getBestWeather(lat, lng);
    let coords = {start: {lat: lat, lng: lat}, goal: {lat: goal.latitude, lng: goal.longitude}};
    // let transport = xxx.xxx(coords)
    return goal;
    // return transport
}

module.exports= {cacheData, getData}
