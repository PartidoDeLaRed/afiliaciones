var express = require('express')
var app = express.Router()

app.get('/afiliate', function (req, res) {
  res.render('form')
})

module.exports = app
