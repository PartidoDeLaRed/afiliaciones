var path = require('path')
var handlebars = require('express-handlebars')
var config = require('../../config')

var viewsPath = path.join(__dirname, '..', '..')

module.exports = function views (app) {
  app.engine('.hbs', handlebars({
    layoutsDir: viewsPath,
    extname: '.hbs',
    partialsDir: viewsPath
  }))

  app.set('view engine', '.hbs')
  app.set('views', viewsPath)

  if (config.env === 'production') {
    app.enable('view cache')
  }
}
