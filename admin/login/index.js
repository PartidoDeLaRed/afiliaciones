var express = require('express')
var passport = require('passport')

var app = express.Router()

app.get('/admin/login', function (req, res) {
  res.render('login')
})

app.post('/admin/login', passport.authenticate('local'), function (req, res) {
  res.redirect('/admin')
})

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/admin')
})

module.exports = app
