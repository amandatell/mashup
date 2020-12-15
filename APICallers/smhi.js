
    https = require('https');
    var cloudDataCache;
    var tempDataCache;

    function getTemp(params) {
        
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