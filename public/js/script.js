$(document).ready(function () {
    $.ajax({
      url: 'http://localhost:3000/',
      headers: {"Accept": "application/json"}
    })
    .done(function (data) { 
        console.log(data)
    });
});