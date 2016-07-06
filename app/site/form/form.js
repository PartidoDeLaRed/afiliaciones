var $ = require('jquery')
var barrios = require('./barrios.json')

require('selectize')

$('#select-state').selectize({
    options: barrios
});