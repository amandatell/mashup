const smhi = require('./smhi');

function cacheData() {
    smhi.init()
}

function getData(lat, lng) {
    let data;
    console.log(lat, lng);
    let goal = smhi.getBestWeather(lat, lng);
    let coords = {start: {lat: parseFloat(lat), lng: parseFloat(lng)}, goal: {lat: goal.latitude, lng: goal.longitude}};
    console.log(coords)
    // temp hårdkodade värden
    let transport = [{lat: 55.551710, lng: 13.119042}, {lat: 55.479385, lng: 13.217444}]
    // let transport = xxx.xxx(lat: parseFloat(lat), lng: parseFloat(lng), lat: goal.latitude, lng: goal.longitude)
    // data = {start: {lat: parseFloat(lat), lng: parseFloat(lng)}, goal: {lat: goal.latitude, lng: goal.longitude}}
    data = {start: coords.start, goal: coords.goal, transport}
    console.log(data)
    return data;
    // return transport
}
// Göra promise
function getCoords(cityName){
    let data = '';
    https.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cityName}&region=sv&key=AIzaSyA-2b37L9ktBGKwKoZ46ZWl3x6md9xiBSI`, 
    (resp) =>{
        
        resp.on('data', (chunk) => {
            data += chunk;
        });
 
        resp.on('end', () =>{
            coords = JSON.parse(data); 
            const x = 0
            coords = coords.results[x].geometry.location;
            console.log(coords)
        });
    });
    //console.log(coords)
}

module.exports= {cacheData, getData, getCoords}
