var express = require('express')
var passport = require('passport')
var User = require('../models').User

var app = express()

app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

module.exports = app
