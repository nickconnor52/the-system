var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var WeekSchema = new Schema({
  number: String,
  season: String
});

var Week = mongoose.model("Week", WeekSchema);
module.exports = Week;