const smhi = require('./smhi');

function cacheData() {
    smhi.init()
}

function getData(lat, lng) {
    let json;
    console.log(lat, lng);
    let goal = smhi.getBestWeather(lat, lng);
    let coord = {start: {lat: lat, lng: lat}, goal: {lat: goal.latitude, lng: goal.longitude}};
    return goal;
    // let transport = xxx.xxx(coords.lat, coords.lng, goal.lat, goal.lng)
    // consol.log(transport)
    // Lägga i start, goal och transport i ett JSON och returnera till index
    // return json
}

module.exports= {cacheData, getData}
