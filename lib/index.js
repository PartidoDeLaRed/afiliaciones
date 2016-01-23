var path = require('path')
var express = require('express')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var config = require('../config')
var models = require('./models')

var app = express()

// Parse parameters
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
app.use(methodOverride('_method'))

// Cookie session parsing
app.use(cookieParser())
app.use(cookieSession({keys: [config.secret]}))

// Serve static assets
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.static(path.join(__dirname, '..', 'build')))

require('./auth')(app)

// Views
app.use(require('../site'))
app.use(require('../admin'))

app.start = function (port, cb) {
  models.ready().then(function () {
    app.listen(port, cb)
  })
}

module.exports = app
