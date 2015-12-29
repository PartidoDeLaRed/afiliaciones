var path = require('path')
var handlebars = require('express-handlebars')
var config = require('../config')

var layoutsPath = path.join(__dirname, '..', 'layouts')
var viewsPath = path.join(__dirname, '..')

module.exports = function views (app) {
  app.engine('.hbs', handlebars({
    layoutsDir: layoutsPath,
    defaultLayout: 'admin',
    extname: '.hbs',
    partialsDir: viewsPath
  }))

  app.set('view engine', 'handlebars')
  app.set('views', viewsPath)

  if (config.env === 'production') {
    app.enable('view cache')
  }
}
