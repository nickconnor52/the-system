var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ScheduleSchema = new Schema({
  week: String,
  scheduleStatus: String,
  originalDate: String,
  originalTime: String,
  delayedPostponedReason: String,
  date: String,
  time: String,
  homeTeam: { ID: String, City: String, Name: String, Abbreviation: String },
  awayTeam: { ID: String, City: String, Name: String, Abbreviation: String },
  location: String,
  season: String
}, { collection: 'schedule'});

var Schedule = mongoose.model("Schedule", ScheduleSchema);
module.exports = Schedule;