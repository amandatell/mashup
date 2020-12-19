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
        if (req.query.place) {
            apiController.getCoords(req.query.place).then(response => res.json(response))
        }
        else {
            let lat = req.query.lat;
            let lng = req.query.lng;
            goal = apiController.getData(lat, lng);
            console.log(goal);
            res.json(JSON.stringify(goal));
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
  $.ajax({
    url: window.location.href,
    async: false,
    headers: {"Accept": "application/json"}
  })
  .done(function (data) { 
      finalData = JSON.parse(data);
  });

}*/