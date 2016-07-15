var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET udpate page. */
router.get('/update', function(req, res, next) {
  res.render('demo', {});
});

module.exports = router;
