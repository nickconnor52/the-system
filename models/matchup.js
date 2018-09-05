var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
  correctPick: Boolean
});

var Matchup = mongoose.model("Matchup", MatchupSchema);
module.exports = Matchup;