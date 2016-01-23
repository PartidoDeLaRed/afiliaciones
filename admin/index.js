var express = require('express')

var app = express()

require('../lib/views')(app, {path: __dirname})

app.get('/admin', function (req, res) {
  res.redirect(req.user ? '/admin/peers' : '/admin/login')
})

app.use(require('./login'))

app.all('/admin*', function (req, res, next) {
  if (req.user) return next()
  res.redirect('/admin')
})

app.use(require('./api'))
app.use(require('./peers'))

module.exports = app
