#!/usr/local/bin/node

/*
 * @file_name: index.js
 *
 */

// Load required packages

var express = require('express'),
   http = require('http'),
   bodyParser = require('body-parser'),
   passport = require('passport'),
   multer = require('multer');


// Create our Express application
var app = express();
var upload = multer();
app.set('port', 3000);
//app.use(express.static('views'));

// Create Express router
var router = express.Router();

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

// respond to GET with a small piece of HTML
app.get('/', function(req, res) {
   res.sendFile(__dirname + '/views/index.html', (err) => {
      if (err) {
         console.error(err);
         res.status(err.status).end();
      }
   });
});


app.route('/api/loadsheets')
   .post(upload.array(), function(req, res) {
      var ctype = req.get("content-type");
      console.log(req.body);
      console.log(ctype);
      console.log(upload);
/*      if (err) {
         console.error(err);
         res.status(err.status).end();
      }*/
//      res.send(res.status);
      res.send('<p>File uploaded successfully, processing spreadsheet</p>');
   });

// Start the server
http.createServer(app).listen(app.get('port'), () => {
   console.log('Server listening on port ' + app.get('port'));
});
