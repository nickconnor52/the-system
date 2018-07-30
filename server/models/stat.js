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

  // Calculated Statistics
  homeTeamStats.calculatedProperties = generateRawCalculatedProperties(homeTeamStats, awayTeamStats)
  awayTeamStats.calculatedProperties = generateRawCalculatedProperties(awayTeamStats, homeTeamStats)

  return '-6.9'
}

var applyPointAdjustments = () => {
  // Apply logic for Blue Section to adjust spread
}

var generateRawCalculatedProperties = (team, opponent) => {
  var calculatedProperties = {}

  var pointsPerYard = 0.06468441

  calculatedProperties.losPerDrive = offDefStatAverage(team.offLOSDrive, opponent.defLOSDrive)
  calculatedProperties.thirdDownPct = offDefStatAverage(team.off3rdPct, opponent.def3rdPct)

  calculatedProperties.giveTakePerGame = parseInt(team.giveTakeDiff) / 9;

  calculatedProperties.rzaPerGame = offDefStatAverage(team.offRZAGame, opponent.defRZAGame)
  calculatedProperties.ptsPerRZA = offDefStatAverage(team.offPtsRz, opponent.defPtsRz)
  calculatedProperties.rzaPts = calculatedProperties.rzaPerGame * calculatedProperties.ptsPerRZA

  calculatedProperties.passYdsPerGame = offDefStatAverage(team.offPassYdsGame, opponent.defPassYdsGame)
  calculatedProperties.rushYdsPerGame = offDefStatAverage(team.offRushYdsGame, opponent.defRushYdsGame)
  calculatedProperties.totalYdsPerGame = calculatedProperties.passYdsPerGame + calculatedProperties.rushYdsPerGame

  calculatedProperties.pointsFromYards = calculatedProperties.totalYdsPerGame * pointsPerYard
  calculatedProperties.pointsPerGame = offDefStatAverage(team.offPtsGame, opponent.defPtsGame)

  calculatedProperties.adjustedPointsPerGame = (calculatedProperties.pointsFromYards + calculatedProperties.pointsPerGame) / 2
  
  return calculatedProperties
}

var offDefStatAverage = (teamStat, opponentStat) => {
  return (parseFloat(teamStat) + parseFloat(opponentStat)) / 2;
}

var findTeamStatsByWeekAndId = (teamId, weekNumber) => {
  var teamObjId = new ObjectId(teamId.toString())
  return Stat.findOne({ 'team': teamObjId, 'week': weekNumber }, {}, {}).exec()
}

var Stat = mongoose.model("Stat", StatSchema);

module.exports = Stat;
