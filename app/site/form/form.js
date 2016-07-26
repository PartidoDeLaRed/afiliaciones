var $ = require('jquery')
var barrios = require('./barrios.json')

require('selectize')

var multiSelectBarrios = $('#select-state').selectize({
    options: barrios
});

var barriosValue = multiSelectBarrios[0].selectize;
$('#select-state').show();
$('#select-state').css({ 'height': '0px', 'float': 'left', 'position': 'relative', 'top': '38px', 'left': '150px', 'opacity': '0' });

$(document).ready(function() {

    $('#form-afiliate').on('submit', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        data = $(this).serializeArray();
        $.post('/afiliate', data)
            .success(function() {
                window.location = '/afiliate/success';
            })
            .fail(function(err) {
                alert(err);
            })

        return false;
    })
})
