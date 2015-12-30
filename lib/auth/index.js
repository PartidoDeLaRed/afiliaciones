var passport = require('passport')
var User = require('../models').User

module.exports = function views (app) {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(User.createStrategy())
  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())
}
