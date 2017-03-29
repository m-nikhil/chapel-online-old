//Created by Nikhil gsoc@2017

var express = require('express')
var engine = require('ejs-locals');
var app = express();


app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.static('static'));

//routes
var home = require('./routes/home');
app.use('/',home);

var run = require('./routes/run');
app.use('/run',run);

app.listen(3000, function(){
	console.log('Chapel-online listening on port 3000');
});
