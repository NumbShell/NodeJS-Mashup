var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var tweets = {1:"data", 2:"data", 3:"data"};
  res.render('index', {tweets: tweets});
});

/* GET documentation page. */
router.get('/docs', function(req, res, next) {
    res.render('docs');
});

module.exports = router;
