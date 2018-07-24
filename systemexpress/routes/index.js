var express = require('express');
var router = express.Router();

// Models
var Team = require("../models/team");
var Stat = require("../models/stat");
var Matchup = require("../models/matchup");

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET teams page
router.get('/teams', function(req, res, next) {
  Team.find({}, {}, function (error, teams) {
    if (error) { console.error(error); }
    res.send({
      teams: teams
    })
  })
});

// GET Stats for the week
router.get('/stats', function(req, res, next) {
  Stat.find({}, {}, function (error, stats) {
    if (error) { console.error(error); }
    res.send({
      stats: stats
    })
  })
});

router.get('/matchups', function(req, res, next) {
  Matchup.find({}, {}, function (error, matchups) {
    if (error) { console.error(error); }
    res.send({
      matchups: matchups
    })
  })
});



module.exports = router;
// OLD DB CONNECTION USING MONK
// FOR REFERENCE
  // var db = req.db;
  // var collection = db.get('teams');
  // collection.find({}, {}, function(e,docs){
  //   res.send({
  //     "teams" : docs
  //   });
  // });