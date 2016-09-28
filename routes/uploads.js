var express = require('express'),
   util = require('util'),
   fs = require('fs');

var router = express.Router();

router.get('/', function(req, res) {
   res.render('uploadPage.jade', { title : 'I love files!' });
});

router.post('/upload', function(req, res, next) {
   console.log('2:\n' + util.inspect(req.files));
//   console.log(req.files.myFiles);
//   console.log(util.inspect(req.files.myFiles));
//   console.log(req.body);

   if (req.files.length === 0) {
      return next(new Error("Hey, first would you select a file?"));
   } else {
      console.log('3:\n' + util.inspect(req.files));
      req.files.forEach(function(elem) {
         console.log('4 (path):\n' + elem.path);
         console.log('5 (size):\n' + elem.size);
         console.log('6 (original name):\n' + elem.originalname);
         if (elem.size === 0) {
            return next(new Error('This file is empty, perhaps the update failed.'));
         }
         fs.exists(elem.path, function(exists) {
            if (exists) {
               res.end("Got your file!");
            } else {
               res.end("No file uploaded.");
            }
         });
      });
   }
});

module.exports = router
