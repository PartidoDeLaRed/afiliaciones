var express = require('express')

var app = express()

app.locals.layout = 'site/layout/index'

require('./views')(app)

app.use(require('./home'))

module.exports = app
