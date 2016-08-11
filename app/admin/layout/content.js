var $ = require('jquery')

var el = $('.content')

module.exports = {
  load: function load (ctx, next) {
    ctx.content = el
    $('.spinnerContainer').show();
    next()
  },

  unload: function unload (ctx, next) {
    ctx.content.html('') // Limpiar el content
    ctx.content.off() // Desatachear todos los eventos de la vista anterior
    ctx.content = undefined
    next()
  }
}
