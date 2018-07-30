var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId; 

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

StatSchema.statics.generateSpread = function (homeTeamId, awayTeamId, weekNumber) {
  console.log('_id --> ', homeTeamId)
  console.log('weel --> ', weekNumber)
  var homeTeamStats = null
  Stat.findOne({ team: new ObjectId(homeTeamId), week: weekNumber }, {}, function(err, obj) {
    console.log('obj --> ', obj)
    homeTeamStats = obj
  })
  // let awayTeamStats = Stat.find({ team: awayTeamId, week: weekNumber })
  console.log(homeTeamStats.off3rdPct)
  return homeTeamStats.off3rdPct
}

var Stat = mongoose.model("Stat", StatSchema);

module.exports = Stat;
