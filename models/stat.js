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

  var systemSpread = applyPointAdjustments(homeTeamStats.calculatedProperties, awayTeamStats.calculatedProperties)
  
  return systemSpread
}

var applyPointAdjustments = (homeTeam, awayTeam) => {
  var homeWeightedTotal = 0
  var awayWeightedTotal = 0
  
  // Points from Starting Position
  if (homeTeam.losPerDrive > 30) {
    homeWeightedTotal += 2
  }

  if (awayTeam.losPerDrive > 30) {
    awayWeightedTotal += 2
  }

  // Turnover Diff Adjust
  var giveTakeAdjust = 0
  if (homeTeam.giveTakePerGame > awayTeam.giveTakePerGame) {
    giveTakeAdjust = (homeTeam.giveTakePerGame - awayTeam.giveTakePerGame) * 3
    homeWeightedTotal += giveTakeAdjust
  } else {
    giveTakeAdjust = (awayTeam.giveTakePerGame - homeTeam.giveTakePerGame) * 3
    awayWeightedTotal += giveTakeAdjust
  }

  // Points from 3rd Down
  var homeThirdAdjust = homeTeam.thirdDownPct - awayTeam.thirdDownPct
  var awayThirdAdjust = homeThirdAdjust * -1
  if (homeThirdAdjust >= 7) {
    homeWeightedTotal += 1
  } else if (homeThirdAdjust >= 4.5) {
    homeWeightedTotal += .5
  } else if (awayThirdAdjust >= 7) {
    awayWeightedTotal += 1
  } else if (awayThirdAdjust >= 4.5) {
    awayWeightedTotal += .5
  }

  // RZ Difference
  if (homeTeam.rzaPts > awayTeam.rzaPts) {
    homeWeightedTotal += homeTeam.rzaPts - awayTeam.rzaPts
  } else if (awayTeam.rzaPts > homeTeam.rzaPts) {
    awayWeightedTotal += awayTeam.rzaPts - homeTeam.rzaPts
  }

  var homePPGAdjust = 0
  var awayPPGAdjust = 0

  // PPG Difference
  if (homeTeam.adjustedPointsPerGame > awayTeam.adjustedPointsPerGame) {
    homePPGAdjust = homeTeam.adjustedPointsPerGame - awayTeam.adjustedPointsPerGame
    homeWeightedTotal += homePPGAdjust
  } else if (awayTeam.adjustedPointsPerGame > homeTeam.adjustedPointsPerGame) {
    awayPPGAdjust = awayTeam.adjustedPointsPerGame - homeTeam.adjustedPointsPerGame
    awayWeightedTotal += awayPPGAdjust
  }

  // ADD PPG ADJUST TO SPREAD CALC
  var homeFinalScore = (homeWeightedTotal + homeTeam.adjustedPointsPerGame) - homePPGAdjust
  var awayFinalScore = (awayWeightedTotal + awayTeam.adjustedPointsPerGame) - awayPPGAdjust

  return ( homeFinalScore - awayFinalScore ) * -1

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