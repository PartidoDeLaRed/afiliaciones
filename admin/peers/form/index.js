var form = require('express-form')
var field = form.field

module.exports = form(
  field('nombre').trim(),
  field('apellido').trim()
)
