var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var validator = require('express-validator')
var config = require('../../config')

module.exports = function setupServer (app) {
  // Parse parameters
  app.use(bodyParser.json())

  app.use(validator({
    customValidators: {
      isArray: function isArray (value) { return Array.isArray(value) }
    }
  }))

  app.use(bodyParser.urlencoded({extended: false}))

  // Allow to override HTTP method via _method param
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
}
