const express = require('express');
const { render } = require('pug');
const app = express()
const port = 3000

app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    const accept = req.accepts(['html', 'json'])
    if (accept === 'html') {
        res.render('index')
    } else if (accept === 'json') {
        res.json({user: "kalle"})
    } else {
        res.render('404')
    }     
    //testmetod för smhi.    
    apiController.cacheData();
})

app.post('/', (req, res) => {
    if (req.is('application/json')) {
        console.log(req.body);
        const coords = req.body;
        apiController.getData(coords);
        res.json(req.body);
    }
    });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})