var express = require('express')

var app = express()

require('../lib/views')(app, {path: __dirname})

app.get('/admin', function (req, res) {
  res.redirect(req.user ? '/admin/peers' : '/admin/login')
})

app.use(require('./login'))

module.exports = app
