var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET teams page. */
router.get('/teams', function(req, res, next) {
  var db = req.db;
  var collection = db.get('teams');
  collection.find({}, {}, function(e,docs){
    console.log(docs)
    res.render('teams', {
      "teamsList" : docs
    });
  });
});

module.exports = router;
