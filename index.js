#!/usr/local/bin/node

/*
 * @file_name: index.js
 *
 */

// Load required packages

var express = require('express'),
   http = require('http'),
//   bodyParser = require('body-parser'),
   passport = require('passport');


// Create our Express application
var app = express();
app.set('port', 3000);
app.use(express.static('views'));


// Use the body-parser package in our application
//app.use(bodyParser.urlencoded({
// 	extended: true
//}));

// respond to GET with a small piece of HTML
app.get('/lolto', (req, res) => {
   res.send('<html><body><h1>It worked!</h1></body></html>')
});

// Create our Express router
//var router = express.Router();

// Start the server
http.createServer(app).listen(app.get('port'), () => {
   console.log('Server listening on port ' + app.get('port'));
});
