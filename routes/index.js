var express = require('express');
var router = express.Router();
var path = require('path');

var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId; 

// Models
var Team = require("../models/team");
var Stat = require("../models/stat");
var Matchup = require("../models/matchup");

// ------ EXPRESS VIEWS ------
// ---- HOME PAGE  ----
router.get('/api', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// ------ API CALLS -------
// ---- TEAMS ----
router.get('/api/teams', function(req, res, next) {
  Team.find({}, {}, function (error, teams) {
    if (error) { console.error(error); }
    res.send({
      teams: teams
    })
  })
});

// ---- WEEKLY STATS ----
router.get('/api/stats', function(req, res, next) {
  Stat.find({}, {}, function (error, stats) {
    if (error) { console.error(error); }
    res.send({
      stats: stats
    })
  })
});

// ---- MATCHUPS ----
router.get('/api/matchups', function(req, res, next) {
  findAllMatchups(res);
});

router.post('/api/matchups', function(req, res, next) {
  let week = req.body.week
  // TODO: Update Year to not be hardcoded
  Stat.generateSpread(req.body.homeTeam._id, req.body.awayTeam._id, week)
  .then((systemSpread) => {
    var matchup = new Matchup({
      week: week,  // TODO: Get this from the frontend
      season: '2018',
      homeTeam: req.body.homeTeam._id,
      awayTeam: req.body.awayTeam._id,
      vegasSpread: req.body.vegasSpread,
      systemSpread: systemSpread
    })
    matchup.save(function() {
      findAllMatchups(res)
    })
  })
  .catch(error => {
    console.log(error)
  })
})

router.post('/api/matchups/updateLine', function(req, res, next) {
  var matchup = req.body
  Stat.generateSpread(matchup.homeTeam._id, matchup.awayTeam._id, matchup.week)
  .then((systemSpread) => {
    Matchup.findById(new ObjectId(matchup._id), function (err, matchup) {
      matchup.systemSpread = systemSpread
      matchup.save((err, updatedMatch) => {
        res.send(updatedMatch)
      })
    })
  })
})

router.post('/api/matchups/updateAllLines', function(req, res, next) {
  var matchups = req.body.matchups
  matchups.forEach(matchup => {
    Stat.generateSpread(matchup.homeTeam._id, matchup.awayTeam._id, '0')
    .then((systemSpread) => {
      Matchup.findById(new ObjectId(matchup._id), function (err, matchup) {
        matchup.systemSpread = systemSpread
        matchup.save().exec()
      })
    })
  })
})

router.delete('/api/matchups' + '/:id', function(req, res, next) {
  var matchupId = new ObjectId(req.params.id)
  Matchup.findByIdAndDelete(matchupId).exec().then(response => {
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

router.get("*", (req, res) => {  
  res.sendFile(path.join(__dirname, "../", "client", "dist", "index.html"));
});

module.exports = router;
