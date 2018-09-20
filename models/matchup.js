var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');

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
  spreadHistory: []
});

MatchupSchema.plugin(mongoose_delete, { overrideMethods: 'all'});

var Matchup = mongoose.model("Matchup", MatchupSchema);
module.exports = Matchup;