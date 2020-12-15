const smhi = require('./smhi');
const cloudsParam = 16;
const tempParam = 1;

function test(){
    let minLong = 10;
    let maxLong = 20;
    let minLat = 55;
    let maxLat = 56;

    smhi.getData((cloudData, tempData) => {

        let boxedStationsTemp = [];
        let boxedStationsCloud = [];

        for (let i in cloudData.station){
            let element = cloudData.station[i]
            let curLong = element.longitude;
            let curLat = element.latitude;
            
            if(curLat < maxLat && curLat > minLat){
                if (curLong < maxLong && curLong > minLong && element.value != null) {
                    boxedStationsCloud.push(element);
                }
            }
        }

        for(var i in tempData.station){
            let element = tempData.station[i];
            let curLong = element.longitude;
            let curLat = element.latitude;
                if(curLat > minLat && curLat < maxLat){
                    if(curLong > minLong && curLong < maxLong && element.value != null){
                        boxedStationsTemp.push(element);
                    }
                }
        }

        let lowestClouds = 150;
        let lowestCloudsIndex;
        let foundDifference = false;

        for(var i in boxedStationsCloud){
            if(boxedStationsCloud[i].value != null){
                let curCloudvalue = boxedStationsCloud[i].value[0].value;
                if(curCloudvalue < lowestClouds){
                    if(lowestClouds != 150){
                        foundDifference = true;
                        console.log("Difference at: " + i);
                    }
                    lowestCloudsIndex = i;
                }
            }
        }
     

        if(!foundDifference){
            let highestValue = -100;
            let highestIndex;
            for(var i in boxedStationsTemp){
                if(boxedStationsTemp[i].value != null){
                    let tempValue = boxedStationsTemp[i].value[0].value;
                    if(tempValue > highestValue){
                        highestValue = tempValue;
                        highestIndex = i;
                    }
                    console.log("Station: " + boxedStationsTemp[i].name + " || Temp: " + tempValue);
                }
            }
            console.log("Highest temp: " + highestValue + " Measured in: " + boxedStationsTemp[highestIndex].name);
            console.log("---------------------------")
        } else{
            console.log("Lowest amount of clouds found in: " + boxedStationsCloud[lowestCloudsIndex].name + " \nCloud percentage: "
            + boxedStationsCloud[lowestCloudsIndex].value[0].value + "%"
        );
        }  
    });
}

module.exports= {test}