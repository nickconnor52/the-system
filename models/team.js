var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
  name: String,
  location: String,
  logoRef: String,
  nickname: Array
});

var Team = mongoose.model("Team", TeamSchema);
module.exports = Team;