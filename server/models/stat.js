var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId; 

var StatSchema = new Schema({
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
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


StatSchema.statics.generateSpread = function (homeTeamId, awayTeamId, weekNumber) {
  var homeTeamStats = null
  var homeId = new ObjectId(homeTeamId.toString())
  Stat.findOne({ 'team': homeId }, {}, function(err, obj) {
    homeTeamStats = obj
  })
  return '-6.9'
// let awayTeamStats = Stat.find({ team: awayTeamId, week: weekNumber })
}

var Stat = mongoose.model("Stat", StatSchema);

module.exports = Stat;
