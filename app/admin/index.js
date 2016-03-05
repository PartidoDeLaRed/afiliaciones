var express = require('express')
var redirect = require('../shared/redirect')
var renderLayout = require('./layout')

var app = express()

require('../shared/setup-views')(app, {path: __dirname})

app.get('/admin', redirect('/admin/peers'))
app.use('/admin', require('./login'))
app.use('/admin/api', require('./peers-api'))
app.use('/admin/*', renderLayout)

module.exports = app
