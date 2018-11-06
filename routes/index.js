var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');

var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

// Models
var Team = require("../models/team");
var Stat = require("../models/stat");
var Matchup = require("../models/matchup");
var Schedule = require("../models/schedule");

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
      week: week,
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

router.post('/api/matchups/addAllWeeklyMatchups', async function(req, res, next) {
  let week = req.body.week
  await Matchup.populateMatchupsFromSchedule(week)
  // TODO: REMOVE THIS SET TIMEOUT IMMEDIATELY
  // FIGURE OUT WHY ASYNC CALL ORDER ISNT WORKING
  // FINDALLMATCHUPS CALLED BEFORE SAVE IS COMPLETE
  // REQUIRES REFRESH TO SEE UPDATED MATCHUPS
  setTimeout(() => {
    findAllMatchups(res)
  }, 2000)
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
    if (matchup.score && matchup.score.awayTeam) {
      matchup.correctPick = systemOutcome(matchupInfo, currentSpread)
    }
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
  Matchup.findById(matchupId).exec().then(response => {
    response.delete().then(matchup => {
      findAllMatchups(res)
    }).catch(error => {
      console.log(error)
    })
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

var requestOptions = {
  url: 'https://therundown-therundown-v1.p.mashape.com/sports/2/events',
  headers: {
    'X-Mashape-Key': '03pwKVxLlPmsh8EXE081lIE4xgx7p1N9BlujsnOqYw1YT6ugSf',
    'X-Mashape-Host': 'therundown-therundown-v1.p.mashape.com',
    'sport-id': 2
  }
};

router.get('/api/updateVegasLines', (req, res) => {
  request(requestOptions, function (error, response, body) {
    let jsonBody = JSON.parse(body)
    if (jsonBody['events']) {
      jsonBody.events.forEach(async apiMatchup => {
        var awayTeam = {}
        var homeTeam = {}

        // Grab Home and Away Team ID
        apiMatchup.teams.forEach(team => {
          if (team['is_away']) {
            awayTeam['normalized_id'] = team['team_normalized_id']
          } else {
            homeTeam['normalized_id'] = team['team_normalized_id']
          }
        })
        
        // Grab Location
        apiMatchup.teams_normalized.forEach(team => {
          if (team.team_id === awayTeam.normalized_id) {
            awayTeam['location'] = team.name
            awayTeam['abbreviation'] = team.abbreviation
          } else {
            homeTeam['location'] = team.name
            homeTeam['abbreviation'] = team.abbreviation
          }
        })

        let keys = Object.keys(apiMatchup.lines)
        let apiSpread = apiMatchup.lines['1'].spread.point_spread_home
        //  If 5Dimes has no entry, grab next spread available
        if (!apiSpread) {
          apiSpread = apiMatchup.lines[keys[0]].spread.point_spread_home
        }

        //  Chain methods to populate both teams and then update matchup accordingly
        Team.findOne({nickname: awayTeam.abbreviation}).lean()
        .then(team => {
          awayTeam['id'] = team._id
        })
        .then(() => {
          Team.findOne({nickname: homeTeam.abbreviation}).lean()
          .then(team => {
            homeTeam['id'] = team._id
          })
          .then(() => {
            Matchup.findOne({homeTeam: homeTeam['id'], awayTeam: awayTeam['id']}).lean()
            .then(matchup => {
              if (matchup) {
                let currentSpread = apiSpread.toString()
                let timestamp = Date.now()
                let spreadObject = { spread: currentSpread, date: timestamp }
                matchup.spreadHistory.push(spreadObject)
                matchup.vegasSpread = currentSpread
                Matchup.findByIdAndUpdate(matchup._id, matchup, err => {
                  console.log(currentSpread)
                })
              }
            })
          })
        })
        .catch(error => {
          console.log(error)
        })
      })
    }
    res.send(response)
  })
})

function requestVegasLines() {
  request('http://system-picks.herokuapp.com/api/updateVegasLines', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
});
}
setInterval(requestVegasLines, 7200000);

let systemOutcome = (matchup, vegasSpread = false) => {
  let scoreDifferential = matchup.score.awayTeam - matchup.score.homeTeam
  let spread = vegasSpread || matchup.vegasSpread
  let homeTeamFavored = matchup.systemSpread < parseFloat(spread)
  let vegasOutcome = scoreDifferential < parseFloat(spread)

  // Handle a Push scenario before deciding on result
  if (scoreDifferential === parseFloat(spread)) {
    return false
  }
  
  return vegasOutcome === homeTeamFavored
}

router.get("*", (req, res) => {  
  res.sendFile(path.join(__dirname, "../", "client", "dist", "index.html"));
});

module.exports = router;
