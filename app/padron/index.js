var express = require('express')
var renderLayout = require('./layout')

var app = express()

require('../shared/setup-views')(app, {path: __dirname})

app.use('/padron', renderLayout)

module.exports = app
