var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET teams page. */
router.get('/teams', function(req, res, next) {
  res.render('teams', { title: 'TeamList' });
});

module.exports = router;
