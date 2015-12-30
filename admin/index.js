var express = require('express')

var app = express()

app.locals.layout = 'admin/layout/index'

require('./views')(app)

app.use(require('./login'))

module.exports = app
