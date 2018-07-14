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
mongoose.connect('mongodb://localhost:27017/systemdb');
var db = mongoose.connection;
var collection = db.collection('teams')
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

// Models
var Team = require("../models/team");

app.get('/teams', (req, res) => {
  Team.find({}, 'name logoRef', function (error, teams) {
    if (error) { console.error(error); }
    res.send({
      teams: teams
    })
  }).sort({_id:-1})
})

// Add new post -- Deprecated
// app.post('/posts', (req, res) => {
//   var db = req.db;
//   var title = req.body.title;
//   var description = req.body.description;
//   var new_post = new Post({
//     title: title,
//     description: description
//   })

//   new_post.save(function (error) {
//     if (error) {
//       console.log(error)
//     }
//     res.send({
//       success: true,
//       message: 'Post saved successfully!'
//     })
//   })
// })

// Fetch all Teams
app.get('/teams', (req, res) => {
  Team.find({}, 'title logoRef', function (error, teams) {
    if (error) { console.error(error); }
    res.send({
      teams: teams
    })
  }).sort({_id:-1})
})

app.listen(process.env.PORT || 8081)