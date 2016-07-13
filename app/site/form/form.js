var $ = require('jquery')
var barrios = require('./barrios.json')

require('selectize')

$('#select-state').selectize({
    options: barrios
});

$(document).ready(function() {

    $('#form-afiliate').on('submit', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        data = $(this).serializeArray();
        $.post('/afiliate', data)
        .success(function() {
            window.location = '/afiliate/success';
        })
        .fail(function(err){
         	alert(err);
        })


        return false;
    })
})
