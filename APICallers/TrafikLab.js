https = require('https')
const axios = require('axios')

//Returnerar en array av ruttkoordinater baserat på start- och destinationskoordinater.
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
                        //Start- och destinationsnamn är antingen koordinaterna eller stationsnamnet.
                        startName: element.Origin.name,
                        destName: element.Destination.name,
                        
                        //Startkoordinater.
                        startLon: element.Origin.lon,
                        startLat: element.Origin.lat,
        
                        //Destinationskoordinater.
                        destLon: element.Destination.lon,
                        destLat: element.Destination.lat,

                        //Start- och destinationstider.
                        startTime: element.Origin.time,
                        destTime: element.Destination.time,
        
                        //Stopp på vägen, exempelvis busstationer. Om array-längd == 0, finns det inga stopp...
                        stops: []
                    }
                        //Typ av resalternativ, exempelvis buss eller tåg.
                    if (element.hasOwnProperty('Product')) {
                        coordinatesObj["type"] = element.Product.catOutL;
                    }
                    
                        //Array av stopp på vägen.
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
            }).catch(error => {
                //console.log(error)
                reject(null);
                return null;
            });
    });
}

module.exports = { getRoute }

