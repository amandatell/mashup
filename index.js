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
    const accept = req.accepts(['html', 'json'])
    if (accept === 'html') {
        res.render('index')
    } else if (accept === 'json') {
        let lat = req.query.lat;
        let lng = req.query.lng;
        goal = apiController.getData(lat, lng);
        res.send(goal);
    } else {
        res.render('404')
    }
    //testmetod för smhi.
    
})

/*app.post('/', (req, res) => {
    if (req.is('application/json')) {
        console.log(req.body);
        const coords = req.body;
        apiController.getData(coords);
        res.json(req.body);
    }
    });*/

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
