const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//   console.log('Landing page!');
   res.render('index.jade', { title: 'Load Spreadsheet', subtitle : 'HEA Analysis Spreadsheet Loader' });
});

router.post('/assessment', (req, res, next) => {
//   res.render('index.jade', { title: 'Load Spreadsheet', subtitle : 'HEA Analysis Spreadsheet Loader', first : false, second : true, third : true});
});

router.get('/search', (req, res, next) => {
//   console.log('Searching!');
//   res.render('index.jade', {title: 'Load Spreadsheet', subtitle: 'HEA Analysis Spreadsheet Loader', first: false, second : false, third: true });
});

module.exports = router;
