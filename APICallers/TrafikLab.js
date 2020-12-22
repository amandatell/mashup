https = require('https')

// Returns an array of route coordinates based on start and destination coordinates.
function getRoute(startLat, startLon, destLat, destLon, callback) {
    console.log("Fetching route data...")
    let data = '';
    https.get(`https://api.resrobot.se/v2/trip?key=b41bf744-1139-45b2-9651-e05a44854cc0&format=json&destWalk=1,0,3000,75&originCoordLat=${startLat}&originCoordLong=${startLon}&destCoordLat=${destLat}&destCoordLong=${destLon}`,
        (resp) => {
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                let promise = parseData(data);
                promise.then(
                    function (value) {
                        callback(value);
                    },
                    function (error) {
                        console.log(error);
                    }
                )
            })
        });
}

// Since the routes are broken into segments, each segment is made into a separate object. The objects are added to the route array
// in order, from which they then can be extracted.

function parseData(data) {
    console.log('Parsing route data...')
    return new Promise(function (resolve, reject) {
        var route = [];
        var routeFinished = false;
        var trafikLab = JSON.parse(data);
        var jsonRoute = trafikLab.Trip[0].LegList.Leg;
        jsonRoute.forEach(element => {
            var coordinatesObj = {
                //Start- and destination names are either the coordinates or the station name
                startName: element.Origin.name,
                destName: element.Destination.name,
                
                //Start coordinates
                startLon: element.Origin.lon,
                startLat: element.Origin.lat,

                //Destination coordinates
                destLon: element.Destination.lon,
                destLat: element.Destination.lat,

                //Stops on the way, e.g. bus stops. If array length == 0, there are no stops...
                stops: []
            }
                //Type of travel option, e.g. bus, train
            if (element.hasOwnProperty('Product')) {
                coordinatesObj["type"] = element.Product.catOutL;
            }

            if (element.hasOwnProperty('Stops')) {
                var s = element.Stops.Stop;
                s.forEach(element => {
                    var stop = {
                        name: element.name,
                        lon: element.lon,
                        lat: element.lat
                    }
                    coordinatesObj.stops.push(stop);
                })
            }
            route.push(coordinatesObj);
        })
        routeFinished = true;
        console.log('Parsing route data done...');

        if (routeFinished) {
            resolve(route)
        } else {
            reject('Något gick åt helvete')
        }
    })
}

module.exports = { getRoute }

