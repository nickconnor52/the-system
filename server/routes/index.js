var express = require('express');
var router = express.Router();

// Models
var Team = require("../models/team");
var Stat = require("../models/stat");
var Matchup = require("../models/matchup");

// ------ EXPRESS VIEWS ------
// ---- HOME PAGE  ----
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// ------ API CALLS -------
// ---- TEAMS ----
router.get('/teams', function(req, res, next) {
  Team.find({}, {}, function (error, teams) {
    if (error) { console.error(error); }
    res.send({
      teams: teams
    })
  })
});

// ---- WEEKLY STATS ----
router.get('/stats', function(req, res, next) {
  Stat.find({}, {}, function (error, stats) {
    if (error) { console.error(error); }
    res.send({
      stats: stats
    })
  })
});

// ---- MATCHUPS ----
router.get('/matchups', function(req, res, next) {
  findAllMatchups(res);
});

router.post('/matchups', function(req, res, next) {
  let matchup = new Matchup({
    week: '0',  // TODO: Get this from the frontend
    season: '2018',
    homeTeam: req.body.homeTeam._id,
    awayTeam: req.body.awayTeam._id,
    vegasSpread: '-1.5',
    systemSpread: stat.generateSpread(req.body.homeTeam._id, req.body.awayTeam._id, '0')
  })
  matchup.save(function() {
    findAllMatchups(res)
  })
})

let findAllMatchups = (res) => {
  Matchup.find({}, {}, function (error, matchups) {
    if (error) { console.error(error); }
    res.send({
      matchups: matchups
    })
  }).populate('homeTeam awayTeam')
}

module.exports = router;
