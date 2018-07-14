const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://nickconnor52:Cardinals77@ds137611.mlab.com:37611/systemdb');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

// Models
var Team = require("../models/team");

// Fetch all Teams
app.get('/teams', (req, res) => {
  Team.find({}, {}, function (error, teams) {
    if (error) { console.error(error); }
    res.send({
      teams: teams
    })
  }).sort({_id:-1})
})

app.listen(process.env.PORT || 8081)