var express = require('express')
var app = express.Router()

app.get('/admin', function (req, res) {
  res.render('admin/login')
})

module.exports = app
