var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');
var Schedule = require("../models/schedule");
var Team = require("../models/team");


var MatchupSchema = new Schema({
  week: String,
  season: String,
  homeTeam: { type: Schema.Types.ObjectId, ref: 'Team' },
  awayTeam: { type: Schema.Types.ObjectId, ref: 'Team' },
  vegasSpread: String,
  systemSpread: String,
  score: {
    homeTeam: String,
    awayTeam: String
  },
  correctPick: Boolean,
  spreadHistory: [],
  date: String,
  time: String,
  note: String
});

MatchupSchema.plugin(mongoose_delete, { overrideMethods: 'all'});

MatchupSchema.statics.populateMatchupsFromSchedule = async function (week) {
  Schedule.find({'week': week}, {}, function (error, matchups) {
    return matchups.forEach(async function (matchup) {
      await saveMatchup(matchup, week)
    });
  });
}

var saveMatchup = async function (matchup, week) {
  var homeTeam = await findHomeTeamByName(matchup.homeTeam.Name)
  var awayTeam = await findHomeTeamByName(matchup.awayTeam.Name)
  var newMatchup = new Matchup({
    week: week,
    season: '2018',
    homeTeam: homeTeam,
    awayTeam: awayTeam,
    systemSpread: '',
    date: matchup.date,
    time: matchup.time
  })
  return newMatchup.save()
}

var findHomeTeamByName = (name) => {
  return Team.findOne({ 'name': name }, {}, function (error, team) {
    return team
  }).exec()
}

var Matchup = mongoose.model("Matchup", MatchupSchema);
module.exports = Matchup;