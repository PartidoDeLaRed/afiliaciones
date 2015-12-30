var express = require('express')
var app = express.Router()

app.get('/', function (req, res) {
  res.render('site/home')
})

module.exports = app
