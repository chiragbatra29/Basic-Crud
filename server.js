var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var autoIncrement = require('mongoose-auto-increment');
var passport = require('passport');


var connection = mongoose.connect('mongodb://localhost/Server');
autoIncrement.initialize(connection);


//express
var app = express();

app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());


app.use(require('cookie-parser')());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

 app.use(passport.initialize());
 app.use(passport.session());


//Routes
app.use('/api', require('./routes/api'));

//start Server
app.listen(3000);
console.log('Server is running at Port 3000');
