const express = require('express');
const { render } = require('pug');
const apiController = require('./APICallers/apiController');
const app = express()
const port = 3000

app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.static('public'));
app.use(express.json());
apiController.cacheData();

app.get('/', (req, res) => {
    //console.log("Get");
    //console.log(req.query);
    const accept = req.accepts(['html', 'json'])
    if (accept === 'html') {
        
        res.render('index')
    } else if (accept === 'json') { 
        if (req.query.place) {
            let place = apiController.removeUmlaut(req.query.place);
            console.log(place)
            apiController.getCoords(place).then(response => {
                if (response != null){
                    res.json(response)
                }
                    
                else
                    res.sendStatus(400);
        })
    }
        else {
            let lat = req.query.lat;
            let lng = req.query.lng;
            goal = apiController.getData(lat, lng);
            console.log(goal);
            res.json(goal);
        }
    } else {
        res.render('404')
    }

})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

/*
function getData(pos){
    //window.location.search
  

}*/