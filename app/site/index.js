var express = require('express')

var app = express()

require('../shared/setup-views')(app, {path: __dirname})

app.use(require('./home'))
app.use(require('./form'))
app.use(require('./form-sent'))

module.exports = app
