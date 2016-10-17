var express = require('express'),
   util = require('util'),
   fs = require('fs');

var router = express.Router();

router.post('/', function(req, res) {
   res.render('index.jade', { title : 'Load Spreadsheet', subtitle : 'HEA Analysis Spreadsheet Loader', first : false, second : false, third : false });
});

router.post('/upload', function(req, res, next) {
//   console.log('/uploads/upload route found!');
//   console.log(req.body);

   if (req.files.length === 0) {
      return next(new Error("Hey, first would you select a file?"));
   } else {
      console.log('1:\n' + util.inspect(req.files));
      req.files.forEach(function(elem) {
//         console.log('2 (path):\n' + elem.path);
//         console.log('3 (size):\n' + elem.size);
//         console.log('4 (original name):\n' + elem.originalname);
         if (elem.size === 0) {
            return next(new Error('This file is empty, perhaps the update failed.'));
         }
         fs.exists(elem.path, function(exists) {
            if (exists) {
               res.end("File uploaded successfully, processing spreadsheet.");
            } else {
               res.end("No file uploaded.");
            }
         });
      });
   }
});

module.exports = router
