var express = require('express')
var renderLayout = require('./layout')

var app = express()

require('../shared/setup-views')(app, {path: __dirname})

app.get('/admin', function (req, res) {
  res.redirect(req.user ? '/admin/peers' : '/admin/login')
})

app.use(require('./login'))

app.all('/admin/*', function (req, res, next) {
  if (req.user) return next()
  res.redirect('/admin')
})

app.use('/api/admin', require('./peers-api'))

app.use('/admin/*', renderLayout)

module.exports = app
