var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.connect('mongodb://localhost/restful-crud');
autoIncrement.initialize(connection);


//express
var app = express();
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());


//Routes
app.use('/api', require('./routes/api'));

//start Server
app.listen(3000);
console.log('Server is running at Port 3000');
