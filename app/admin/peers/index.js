var express = require('express')

var app = express.Router()

app.get('/*', function (req, res) {
  res.render('layout/empty')
})

module.exports = app
