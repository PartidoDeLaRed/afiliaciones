var handlebars = require('express-handlebars')
var config = require('../../config')

module.exports = function views (app, options) {
  if (!options) options = {}

  app.engine('.hbs', handlebars({
    layoutsDir: options.path,
    extname: '.hbs',
    defaultLayout: 'layout/index',
    partialsDir: options.path
  }))

  app.set('view engine', '.hbs')
  app.set('views', options.path)

  app.all('*', function (req, res, next) {
    if (req.user) res.locals.user = req.user
    next()
  })

  if (config.env === 'production') {
    app.enable('view cache')
  }
}
