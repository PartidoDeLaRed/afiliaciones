var express = require('express')
var redirect = require('../shared/redirect')
var renderLayout = require('./layout')

var app = express()

require('../shared/setup-views')(app, {path: __dirname})

app.use('/padron', renderLayout)

module.exports = app
