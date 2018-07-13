var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
  name: String,
  logoRef: String
});

var Team = mongoose.model("Team", TeamSchema);
module.exports = Team;