var $ = require('jquery')
var toObject = require('form-to-object')

$.put = function (url, data, callback, type) {
  
  if ($.isFunction(data)) {
    type = type || callback,
    callback = data,
    data = {}
  }
  
  return $.ajax({
    url: url,
    type: 'PUT',
    success: callback,
    data: data,
    contentType: type
  });
}


$(document).ready(function () {
  loadSearchBoxes();
  
  $('.button.delete').click(function (ev) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    
    var el = $(this).parents('.peerContainer');
    var id = $(el).attr('data-id');
    var nombre = $(el).find('.peerNombre').html();
    
    ShowDialog('Eliminación de Afiliado', '¿Realmente desea eliminar al afiliado <b>'+nombre+'</b>?', function () {
      $.get('/admin/peers/'+id+'/delete')
      .done(function () { window.location = '/admin/peers'; })
      .fail(function (res) {  });
    });
  });

  $("#peerForm").on('submit', function (ev) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    SaveData();
    return false;
  });

  $("#mismoDomicilioDocumento").on('change', function (ev) {
    if (this.checked)
      $('#sectionDomicilioReal').slideUp('100');
    else
      $('#sectionDomicilioReal').slideDown('100');
  });

})

function loadSearchBoxes() {
  $('.listHeader:not(.actions, .state)').each(function (index, item) {
    $(item).children().remove();
    
    var searchButton = $('<div class="button search" />')
    
    var searchContainer = $('<div class="searchContainer" />').css('display', 'none');
    var searchField = $('<input type="text" class="searchField" />')
    searchContainer.append(searchField.keyup(function (event) {
      //Si borro todo, muestro todos
      var val = this.value;
      if (val === null) {
        $('peerContainer').slideDown('50');
      }
      //Sino, muestro solo los que coincidan con la busqueda
      else {
        var field = $(this).parents('.listHeader').attr('data-field');
        $('.peerContainer').each(function (index, item) {
          if ($(item).find('.peer' + field).html().toLowerCase().indexOf(val.toLowerCase()) >= 0)
            $(item).slideDown('50');
          else
            $(item).slideUp('50');
        })
      }
    })
    );
    searchContainer.append($('<div class="button cancel" />').click(function () {
      searchButton.fadeIn(100)
      searchContainer.fadeOut(100)
      $('peerContainer').slideDown('100');
    }))
    
    searchButton.click(function () {
      searchButton.fadeOut(100)
      searchContainer.fadeIn(100)
      searchField.value = ''
      searchField.focus()
    })
    
    $(item).append(searchButton)
    $(item).append(searchContainer)
  })
}

function SaveData() {
  $('.errorList').slideUp('50', function () {
    $('.errorList').html('')
    
    var form = toObject(document.querySelector('form'))
    
    if (form._id) {
      $.put('/admin/peers/' + form._id, form)
    .done(function () { window.location = '/admin/peers'; })
    .fail(function (res) { showErrors($.parseJSON(res.responseText)); });
    }
    else {
      $.post('/admin/peers/', form)
    .done(function () { window.location = '/admin/peers'; })
    .fail(function (res) { showErrors($.parseJSON(res.responseText)); });
    }
  });
}

function showErrors(err)
{
  $(err.errors).each(function (index, error) {
    $(Object.keys(error)).each(function (index, item) {
      $('.errorList').append($('<div class="errorItem" />').html(error[item].message));
    })
  });
  $('.errorList').slideDown('50');
}

function ShowDialog(title, message, cb)
{
  var wrapper = $('<div class="wrapper fullSize"/>').css('display','none');
  var container = $('<div class="dialogContainer centered"/>');
  var titleContainer = $('<div class="dialogTitle"/>').html(title);
  var messageContainer = $('<div class="dialogMessage"/>').html(message);
  var buttonsContainer = $('<div class="dialogFooter"/>');
  var buttonAccept = $('<div class="dialogButton accept"/>').html('Aceptar').click(function () {
    cb();
    wrapper.fadeOut('200ms', function () {
      wrapper.remove();
    });
  });
  var buttonCancel = $('<div class="dialogButton cancel"/>').html('Cancelar').click(function () {
    wrapper.fadeOut('200ms', function () {
      wrapper.remove();
    });
  });

  $('body').append(wrapper.append(container.append(titleContainer).append(messageContainer).append(buttonsContainer.append(buttonAccept).append(buttonCancel))));
  wrapper.fadeIn('200ms');
}