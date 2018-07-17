var express = require('express');
var router = express.Router();

// Models
var Team = require("../models/team");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET teams page. */
router.get('/teams', function(req, res, next) {
  var db = req.db;
  var collection = db.get('teams');
  collection.find({}, {}, function(e,docs){
    res.send({
      "teamsList" : docs
    });
  });
});

module.exports = router;
