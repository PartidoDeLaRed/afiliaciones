var express = require('express')
var passport = require('passport')

var app = express.Router()

app.get('/admin/peers', function (req, res) {    
  res.render('peers')
})

module.exports = app
