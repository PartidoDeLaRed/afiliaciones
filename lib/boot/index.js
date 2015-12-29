var path = require('path')
var express = require('express')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')

var config = require('../config')

var app = express()

// Cookie session parsing
app.use(cookieParser())
app.use(cookieSession({keys: [config.secret]}))

// Serve static assets
app.use(express.static(path.join(__dirname, '..', '..', 'public')))
app.use(express.static(path.join(__dirname, '..', '..', 'build')))

require('./views')(app)
require('./auth')(app)

app.use(require('../home'))

module.exports = app
