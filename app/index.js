var path = require('path')
var express = require('express')
var config = require('./config')
var models = require('./shared/models')

var app = express()

require('./shared/setup-server')(app)
require('./shared/auth')(app)

// Serve static assets
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.static(path.join(__dirname, '..', 'build')))

// Views
app.use(require('./site'))
app.use(require('./admin'))

app.start = function (cb) {
  models.ready().then(function () {
    app.listen(config.port, cb.bind(app, config.port))
  })
}

module.exports = app
