var path = require('path')
var express = require('express')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser')

var config = require('../config')

var app = express()

// Parse parameters
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Cookie session parsing
app.use(cookieParser())
app.use(cookieSession({keys: [config.secret]}))

// Serve static assets
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.static(path.join(__dirname, '..', 'build')))

require('./views')(app)
require('./auth')(app)

// Views
app.use(require('../site'))
app.use(require('../admin'))

module.exports = app
