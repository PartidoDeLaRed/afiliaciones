var $ = require('jquery')
var barrios = require('./barrios.json')

require('selectize')

$('#select-state').selectize({
  options: barrios
}).show().css({
  'float': 'left',
  'position': 'relative',
  'top': '38px',
  'left': '150px',
  'height': '0px',
  'opacity': '0'
})

$('#form-afiliate').on('submit', function (evt) {
  evt.preventDefault()
  evt.stopPropagation()

  var data = $(this).serializeArray()
  $.post('/afiliate', data).success(function () {
    window.location = '/afiliate/success'
  }).fail(function (err) {
    window.alert('¡Hubo un error! Intentalo mas tarde por favor.')
    console.error(err)
  })

  return false
})
