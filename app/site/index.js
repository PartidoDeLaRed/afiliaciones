var express = require('express')

var app = express()

require('../shared/setup-views')(app, {path: __dirname})

app.use(require('./home'))
app.use(require('./form'))

module.exports = app
