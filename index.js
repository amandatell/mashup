const express = require('express');
const { render } = require('pug');
const apiController = require('./APICallers/apiController');
const app = express()
const port = 80

app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.static('public'));
app.use(express.json());
apiController.cacheData();

// Ändpunkt för startsidan
app.get('/', (req, res) => {
    const accept = req.accepts(['html', 'json'])
    if (accept === 'html') {
        res.render('index')
    
    /*
        Ifall accept === JSON 
        så kollas parametern först.
        Ifall parametern är place så tas åäö först bort 
        och görs om till koordinater och skickas sedan till getData
        Samma svar kommer att skickas till klient vilken parameter som än skickades
    */
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
                    // Status-kod 400 skickas ifall platsen inte finns
                    } else res.status(400).send({
                        error: 'Ingen plats hittades. Var god och kolla stavningen.',
                        statusCode: 400
                    });;
                }
                // Status.kod 404 skickas ifall ingen kollektivtrafik hittades
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
            });
        }
    } 
})

// Ändpunkt för API-dokumentationen
app.get('/api', (req, res) => {
    const accept = req.accepts('html')
    if (accept === 'html') {
        res.render('api')
    }
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
