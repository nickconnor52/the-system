var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var StatSchema = new Schema({
  team: String,
  week: String,
  offLOSDrive: String,
  defLOSDrive: String,
  offPtsRz: String,
  defPtsRz: String,
  giveTakeDiff: String,
  off3rdPct: String,
  def3rdPct: String,
  offPassYdsGame: String,
  offRushYdsGame: String,
  defPassYdsGame: String,
  defRushYdsGame: String,
  offRZAGame: String,
  defRZAGame: String,
  offPtsGame: String,
  defPtsGame: String
});

statSchema.methods.generateSpread = function (homeTeamId, awayTeamId, weekNumber) {
  let homeTeamStats = Stat.find({ team: homeTeamId, week: weekNumber })
  let awayTeamStats = Stat.find({ team: awayTeamId, week: weekNumber })

  return homeTeamStats
}

var Stat = mongoose.model("Stat", StatSchema);
module.exports = Stat;
