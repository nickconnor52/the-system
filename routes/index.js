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
    let currentSpread = req.body.vegasSpread
    let timestamp = Date.now()
    let spreadObject = { spread: currentSpread, date: timestamp }
    matchup.spreadHistory.push(spreadObject)
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
      if (matchup.score) {
        matchup.correctPick = systemOutcome(matchup)
      }
      matchup.save((err, updatedMatch) => {
        res.send(updatedMatch)
      })
    })
  })
})

router.post('/api/matchups/updateAllLines', function(req, res, next) {
  var matchups = req.body.matchups
  var week = req.body.week
  matchups.forEach(matchup => {
    Stat.generateSpread(matchup.homeTeam._id, matchup.awayTeam._id, week)
    .then((systemSpread) => {
      Matchup.findById(new ObjectId(matchup._id), function (err, matchup) {
        matchup.systemSpread = systemSpread
        matchup.save().exec()
      })
    })
  })
})

router.post('/api/matchups/updateScore', function(req, res, next) {
  var matchupInfo = req.body
  Matchup.findById(new ObjectId(matchupInfo._id), function (err, matchup) {
    matchup.score = matchupInfo.score
    matchup.correctPick = systemOutcome(matchupInfo)
    matchup.save((err, updatedMatch) => {
      res.send(updatedMatch)
    })
  })
})

router.post('/api/matchups/updateSpread', function(req, res, next) {
  var matchupInfo = req.body
  Matchup.findById(new ObjectId(matchupInfo._id), function (err, matchup) {
    let currentSpread = matchupInfo.currentSpread
    let timestamp = Date.now()
    let spreadObject = { spread: currentSpread, date: timestamp }
    matchup.spreadHistory.push(spreadObject)
    matchup.vegasSpread = currentSpread
    matchup.save((err, updatedMatch) => {
      res.send(updatedMatch)
    })
  })
})

router.post('/api/stats/getMatchupStats', async function(req, res, next) {
    let homeTeamId = req.body.homeTeam._id
    let awayTeamId = req.body.awayTeam._id
    let weekNumber = req.body.week
    // Home Team
    var homeTeamStats = null
    homeTeamStats = await findTeamStatsByWeekAndId(homeTeamId, weekNumber)
    
    // Away Team
    var awayTeamStats = null
    awayTeamStats = await findTeamStatsByWeekAndId(awayTeamId, weekNumber)

    res.send({ awayTeamStats, homeTeamStats })
})

var findTeamStatsByWeekAndId = (teamId, weekNumber) => {
  var teamObjId = new ObjectId(teamId.toString())
  return Stat.findOne({ 'team': teamObjId, 'week': weekNumber }, {}, {}).populate('team').exec()
}

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

let systemOutcome = (matchup) => {
  let scoreDifferential = matchup.score.awayTeam - matchup.score.homeTeam
  let homeTeamFavored = matchup.systemSpread < parseFloat(matchup.vegasSpread)
  let vegasOutcome = scoreDifferential < parseFloat(matchup.vegasSpread)
  return vegasOutcome === homeTeamFavored
}

router.get("*", (req, res) => {  
  res.sendFile(path.join(__dirname, "../", "client", "dist", "index.html"));
});

module.exports = router;
