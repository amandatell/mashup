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
                    if(response != "locNotFound"){
                        console.log("RESPONSE SENT:")
                        console.log(response)   
                        res.json(response)
                    } else res.status(400).send({
                        error: 'Ingen plats hittades. Var god och kolla stavningen.',
                        statusCode: 400
                    });;
                }
                    
                else{
                    res.status(404).send({
                        error: 'Ingen kollektivtrafik hittades. Var god och byt startpunkt.',
                        statusCode: 404
                    });
                    console.log("SENT ERROR STATUS");
                }
        })
    }
        else {
            let lat = req.query.lat;
            let lng = req.query.lng;
            goal = apiController.getData(lat, lng).then(response => {
                res.json(response)
                console.log('log1: ' + response)
            });
            //console.log(goal);
            //res.json(goal);
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