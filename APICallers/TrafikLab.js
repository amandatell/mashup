https = require('https')
var route = []; // Array with the complete route

// Returns an array of route coordinates based on start and destination coordinates.
function getRoute(startLat, startLong, destLat, destLong) {
    console.log(" Fetching route data...")
    let data = '';
    https.get(`https://api.resrobot.se/v2/trip?key=b41bf744-1139-45b2-9651-e05a44854cc0&format=json&originCoordLat=${startLat}&originCoordLong=${startLong}&destCoordLat=${destLat}&destCoordLong=${destLong}`,
        (resp) => {
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                parseData(data);
                return route; //<--- Ändra till callback typ som Tim har gjort?
            });
        });
}

// Since the routes are broken into segments, each segment is made into a separate object. The objects are added to the route array
// in order, from which they then can be extracted.
function parseData(data) {
    console.log('Parsing route data...')
    var trafikLab = JSON.parse(data);
    var jsonRoute = trafikLab.Trip[0].LegList.Leg;

    jsonRoute.forEach(element => {
        var coordinatesObj = {
            startLong: element.Origin.lon,
            startLat: element.Origin.lat,
            destLong: element.Destination.lon,
            destLat: element.Destination.lat
        }
        route.push(coordinatesObj);
    })

    //Test method to check coordinates
    route.forEach(element => {
        console.log('Start: ' + 'Longitud: ' + element.startLong + ' / ' + 'Latitud: ' + element.startLat + '\n' +
            'Destination: ' + 'Longitud: ' + element.destLong + ' / ' + 'Latitud: ' + element.destLat + '\n');
    })
}

module.exports = { getRoute }

