var form = require('express-form')
var field = form.field

module.exports = form(
  field('nombre').trim().is(/^[a-z]+$/),
  field('apellido').trim().is(/^[a-z]+$/)
)