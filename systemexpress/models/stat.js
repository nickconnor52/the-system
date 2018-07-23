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
  offYdsGame: String,
  defYdsGame: String,
  offRZAGame: String,
  defRZAGame: String,
});

var Stat = mongoose.model("Stat", StatSchema);
module.exports = Stat;
