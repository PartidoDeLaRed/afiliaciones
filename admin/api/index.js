var express = require('express')

var app = express.Router()

app.use('/api/admin', require('./peers'))

module.exports = app
