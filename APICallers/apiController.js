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

    testTrafikLab(lat, lng, goal.latitude, goal.longitude);

    // let transport = xxx.xxx(coords)
    return goal;
    // return transport
}

function testTrafikLab(startLat, startLon, destLat, destLon) {
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



module.exports= {cacheData, getData, testTrafikLab}
