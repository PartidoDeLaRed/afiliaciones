var express = require('express')
var app = express.Router()

app.get('/afiliate/success', function (req, res) {
  res.render('form-sent')
})

module.exports = app
