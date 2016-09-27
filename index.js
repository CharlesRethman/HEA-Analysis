#!/usr/local/bin/node

/*
 * @file_name: index.js
 *
 */

// Load required packages

var express = require('express'),
   http = require('http'),
   fs = require('fs'),
//   bodyParser = require('body-parser'),
   passport = require('passport'),
   multer = require('multer'),
   busboy = require('connect-busboy');


// Create our Express application
var app = express();
var upload = multer();
app.set('port', 3000);
//app.use(express.static('views'));

// Create Express router
var router = express.Router();

/*// Use the body-parser package in our application
<<<<<<< HEAD
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));*/

app.use(busboy());
/*=======
app.use(bodyParser.urlencoded({
 	extended: true
}));*/
>>>>>>> 437affc2c14c5a92fb9c4b7ac87866138abfcc5b

// respond to GET with a small piece of HTML
app.get('/', (req, res) => {
   res.sendFile(__dirname + '/views/index.html', (err) => {
      if (err) {
         console.error(err);
         res.status(err.status).end();
      }
   });
});


<<<<<<< HEAD
app.post('/api/loadsheets', upload.array(), (req, res) => {
//   var ctype = req.get("content-type");
//   console.log(req.query['enterPath']);
   console.log(req.body);
   console.log(req.files);
//   console.log(ctype);
   console.log(upload);
=======
app.route('/api/loadsheets')
   .post(function(req, res) {
      var ctype = req.get("content-type");
      console.log(ctype);
>>>>>>> 437affc2c14c5a92fb9c4b7ac87866138abfcc5b
/*      if (err) {
         console.error(err);
         res.status(err.status).end();
      }*/
//      res.send(res.status);
<<<<<<< HEAD
   res.send('<p>File uploaded successfully, processing spreadsheet</p>');
});
=======
      res.send('<p>File uploaded successfully, processing spreadsheet</p>');
   });
>>>>>>> 437affc2c14c5a92fb9c4b7ac87866138abfcc5b

// Start the server
http.createServer(app).listen(app.get('port'), () => {
   console.log('Server listening on port ' + app.get('port'));
});
