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


StatSchema.statics.generateSpread = async function (homeTeamId, awayTeamId, weekNumber) {
  // Home Team
  var homeTeamStats = null
  homeTeamStats = await findTeamStatsByWeekAndId(homeTeamId, weekNumber)

  // Away Team
  var awayTeamStats = null
  awayTeamStats = await findTeamStatsByWeekAndId(awayTeamId, weekNumber)

  return '-6.9'
}

var findTeamStatsByWeekAndId = (teamId, weekNumber) => {
  var teamObjId = new ObjectId(teamId.toString())
  return Stat.findOne({ 'team': teamObjId, 'week': weekNumber }, {}, {}).exec()
}

var Stat = mongoose.model("Stat", StatSchema);

module.exports = Stat;
