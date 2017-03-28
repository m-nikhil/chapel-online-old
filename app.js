//Created by Nikhil @2017

var express = require('express')
var engine = require('ejs-locals');
var app = express();


app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.static('static'));

app.get('/',function(resquest, response) {
	response.render('index');
});

app.listen(3000, function(){
	console.log('Chapel-online listening on port 3000');
});
