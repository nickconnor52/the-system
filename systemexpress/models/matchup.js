var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MatchupSchema = new Schema({
  week: String,
  season: String,
  homeTeam: String,
  awayTeam: String,
  vegasSpread: String,
  systemSpread: String,
});

var Matchup = mongoose.model("Matchup", Matchupchema);
module.exports = Matchup;