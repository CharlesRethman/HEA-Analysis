var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//   console.log('Landing page!');
   res.render('index.jade', { title: 'Load Spreadsheet', subtitle : 'HEA Analysis Spreadsheet Loader', first : true, second : true, third : true});
});

router.post('/assessment', (req, res, next) => {
//   res.render('index.jade', { title: 'Load Spreadsheet', subtitle : 'HEA Analysis Spreadsheet Loader', first : false, second : true, third : true});
   res.send('<p>Extra HTML</p>');
});

router.get('/search', (req, res, next) => {
//   console.log('Searching!');
//   res.render('index.jade', {title: 'Load Spreadsheet', subtitle: 'HEA Analysis Spreadsheet Loader', first: false, second : false, third: true });
});

module.exports = router;
