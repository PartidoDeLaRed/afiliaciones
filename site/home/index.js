var express = require('express')
var app = express.Router()

app.get('/', function (req, res) {
  res.render('home')
})

module.exports = app
