const e = require('express');
const cron = require('node-cron');

https = require('https');
const boxSize = 2;
var cloudDataCache;
var tempDataCache;

function init() {
    getData();
    cron.schedule('* * 1 * * *', () =>{
        getData();
    });
    //getData();
}


    /*
    Metoden tar in din nuvarande position, och returnerar sedan lite info kring den 
    väder-station som rapporterat in bäst väder inom den senaste timmen.

    Kontrollen kommer att prioritera stationer med minst moln, men om alla stationer i området
    rapporterat in samma mängd moln, kommer istället en kontroll på temperatur att jämföras.

    Den station som returneras är den sist funna med det bästa funna värdet, och det finns alltså
    ingen prioritering kring närhet till startposition.

    Retur:
    {
        id : "val" ,
        longitude : "val",
        latitude : "val",
        temp : "val",
        cloud : "val"
    }
    Viktigt att notera kring returvärdet är att antingen cloud eller temp kan vara null.
    Detta kommer sig av att det inte är säkert att samma station rapporterat både väder
    och temperatur vid samma tillfälle. Om stationen rapporterat båda, ska dock båda värden
    finnas med.
    */
function getBestWeather(curLat, curLong) {
    let boxedClouds = [];
    let boxedTemp = [];
    let maxLong = curLong + boxSize;
    let minLong = curLong - boxSize;
    let maxLat = curLat + boxSize;
    let minLat = curLat - boxSize;
    let differenceClouds = false;
    let ret = {
        ['id'] : null,
        ['longitude'] : null,
        ['latitude'] : null,
        ['temp'] : null,
        ['cloud'] : null
    };
    
    //Här plockas både inrapporterad moln-data och temperatur inom ett specifikt område ut, och placeras
    //i nya arrayer för analys. När molndata plockas ut kontrolleras även ifall det finns skillnader i dessa
    //för att avgöra om det är moln eller temperatur resultatet ska baseras på.
    for(var i in cloudDataCache.station){
        let element = cloudDataCache.station[i];
        
        let stationLong = element.longitude;
        let stationLat = element.latitude;

        if(element.value != null && stationLong > minLong && stationLong < maxLong){
            if(stationLat < maxLat && stationLat > minLat){
                let len = boxedClouds.length;
                if(len > 1 && boxedClouds[len-1].value[0].value != element.value[0].value){
                    differenceClouds = false;
                }
                boxedClouds.push(element);
            
            }
        }
    }

    for(var i in tempDataCache.station){
        let element = tempDataCache.station[i];
        let stationLong = element.longitude;
        let stationLat = element.latitude;

        if(element.value != null && stationLong < maxLong  && stationLong > minLong){
            if(stationLat > minLat && stationLat < maxLat){
                boxedTemp.push(element);
            }
        }
    }


    if(differenceClouds){
        let minClouds = 150;
        for(var i in boxedClouds){
            if(boxedClouds[i].value[0].value < minClouds){
                minClouds = boxedClouds[i].value[0].value;
                ret.id = boxedClouds[i].key;
                ret.longitude = boxedClouds[i].longitude;
                ret.latitude = boxedClouds[i].latitude;
                ret.cloud = boxedClouds[i].value[0].value;
                ret.temp = null;
            }
        }

        for(var i in boxedTemp){
            
            if(ret.id == boxedTemp[i].key){
                if(boxedTemp[i].value != null){
                    ret.temp = boxedTemp[i].value[i].value;
                }
                
            }
        }
        //Detta körs om man inte hittat någon skillnad i alla genomsökta moln.
        //börjar med att leta upp en av stationerna med bäst temperatur.
    } else{
        let maxTemp = -100;
        for(var i in boxedTemp){
            if(boxedTemp[i].value[0].value > maxTemp){
                maxTemp = boxedTemp[i].value[0].value;
                ret.id = boxedTemp[i].key;
                ret.longitude = boxedTemp[i].longitude;
                ret.latitude = boxedTemp[i].latitude;
                ret.temp = boxedTemp[i].value[0].value;
                ret.cloud = null;
            }
        }
        //Kollar sedan efter molnvärde i listan med stationer som rapporterat detta.
        for(var i in boxedClouds){
            if(ret.id == boxedClouds[i].key){
                if(boxedClouds[i].value != null){
                    ret.cloud = boxedClouds[i].value[0].value;
                }
            }
        }
    }
    return ret;
}


/*
Metoden uppdaterar data-cachen.
*/
function getData() {
    getTemp((cloudData, tempdata) => {
        cloudDataCache = cloudData;
        tempDataCache = tempdata;
        console.log("SMHI: updated data.");
    });   
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

module.exports = {getBestWeather, init}