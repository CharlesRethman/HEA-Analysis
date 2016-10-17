var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//   console.log('Landing page!');
   res.render('index.jade', { title: 'Load Spreadsheet', subtitle : 'HEA Analysis Spreadsheet Loader', hide : true });
});

router.get('/search', (req, res, next) => {
//   console.log('Searching!');
   res.render('index.jade', {title: 'Load Spreadsheet', subtitle: 'HEA Analysis Spreadsheet Loader', hide : false });
});

module.exports = router;
