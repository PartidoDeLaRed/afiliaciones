var express = require('express')

var app = express()

require('../shared/setup-views')(app, {path: __dirname})

app.use(require('./home'))

module.exports = app
