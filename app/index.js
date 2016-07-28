var path = require('path')
var express = require('express')
var certbotEndpoint = require('express-certbot-endpoint')
var config = require('./config')
var models = require('./shared/models')

var app = express()

app.use(certbotEndpoint(config.certbot))

require('./shared/setup-server')(app)
require('./shared/auth')(app)

// Serve static assets
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.static(path.join(__dirname, '..', 'build')))

// Load Sub-apps
app.use(require('./site'))
app.use(require('./admin'))

/**
 * Start the server
 * @param  {Function} callback
 */
app.start = function (callback) {
  models.ready().then(function () {
    app.listen(config.port, callback.bind(app, config.port))
  })
}

module.exports = app
