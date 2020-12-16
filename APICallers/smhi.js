
    https = require('https');
    const boxSize = 2;
    var cloudDataCache;
    var tempDataCache;

    function init(controllerCallback) {
        getData(controllerCallback);
    }


    //Måste få in timed task för uppdatering av väder data.
    function getBestWeather(curLong, curLat) {
        let boxedClouds = [];
        let boxedTemp = [];
        let maxLong = curLong + boxSize;
        let minLong = curLong - boxSize;
        let maxLat = curLat + boxSize;
        let minLat = curLat - boxSize;
        let differenceClouds = false;
        let ret;
        

        for(var i in cloudDataCache.station){
            let element = cloudDataCache.station[i];
            let stationLong = element.longitude;
            let stationLat = element.latitutde;

            if(element.value != null && stationLong > minLong && stationLong < maxLong){
                if(stationLat < maxLat && stationLat > minLat){
                    let len = boxedClouds.length;
                    if(len > 1 && boxedClouds[len-1].value[0].value != element.value[0].value){
                        differenceClouds = true;
                    }
                    boxedClouds.push(element);
                }
            }
        }

        for(var i in tempDataCache.station){
            let element = tempDataCache.station[i];
            let stationLong = element.longitude;
            let stationLat = element.latitutde;

            if(element.value != null && stationLong < maxLong  && stationLong > minLong){
                if(stationLat > minLat && stationLat < maxLat){
                    boxedTemp.push(stationLat)
                }
            }
        }


        if(differenceClouds){
            let minClouds = 150;
            for(var i in boxedClouds){
                if(boxedClouds[i].value[0].value < minClouds){
                    minClouds = boxedClouds.value[0].value;
                    ret = boxedClouds[i];
                }
            }
        } else{
            let maxTemp = -100;
            for(var i in boxedTemp){
                if(boxedTemp[i].value[0].value > maxTemp){
                    let maxTemp = boxedTemp[i].value[0].value;
                    let ret = boxedTemp[i];
                }
            }
        }

        /*
            {
            "key": "188790",
            "name": "Abisko Aut",
            "owner": "SMHI",
            "ownerCategory": "SMHI",
            "from": 1539676850000,
            "to": 1608120000000,
            "height": 392.303,
            "latitude": 68.3538,
            "longitude": 18.8164,
            "value": [
                {
                    "date": 1608120000000,
                    "value": "-2.6",
                    "quality": "G"
                }
            ]
        }
        */
        return ret;
    }

    function getData(controllerCallback) {
        //check if data is up to date.
        getTemp((cloudData, tempdata) => {
            cloudDataCache = cloudData;
            tempDataCache = tempdata;
        });

        if(cloudDataCache != null && tempDataCache != null){
            controllerCallback(cloudDataCache, tempDataCache);
        }
        
    }

    function getTemp(callback) {
        let data = '';
        https.get('https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station-set/all/period/latest-hour/data.json', 
        (resp) =>{
            
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () =>{
                console.log(data);
                getClouds(callback, JSON.parse(data));
            });
        });
    }

    function getClouds(callback, tempData) {
        let data = '';
        https.get('https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/16/station-set/all/period/latest-hour/data.json', 
        (resp) =>{
            
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                let clouds = JSON.parse(data);
                callback(clouds, tempData);
            });

        });
        
    }

module.exports = {getData}