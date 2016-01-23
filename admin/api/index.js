var express = require('express')

var app = express.Router()

app.use(require('./peers'))

module.exports = app
