https = require('https')
const axios = require('axios')

// Returns an array of route coordinates based on start and destination coordinates.

function getRoute(startLat, startLon, destLat, destLon) {
    return new Promise(function (resolve, reject) {
        console.log('Trafiklab: Fetching data...')
        axios.get(`https://api.resrobot.se/v2/trip?key=b41bf744-1139-45b2-9651-e05a44854cc0&format=json&destWalk=1,0,3000,75&originCoordLat=${startLat}&originCoordLong=${startLon}&destCoordLat=${destLat}&destCoordLong=${destLon}`).then(
            (response) => {
                var trafikLab = response.data;
                var route = [];
                var jsonRoute = trafikLab.Trip[0].LegList.Leg;
                console.log('Trafiklab: Parsing data...')
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
                console.log('Trafiklab: Parsing done!')
                resolve(route)
            }).catch(error => console.log(error));
    });
}

module.exports = { getRoute }

