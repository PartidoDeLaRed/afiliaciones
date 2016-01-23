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

  $('.button.info').click(function (ev) {
    ev.preventDefault();
    ev.stopImmediatePropagation();

    var el = $(this).parents('.peerContainer');
    var id = $(el).attr('data-id');
    var nombre = $(el).find('.peerNombre').html();

    $.get('/admin/peers/' + id)
    .done(function (res) {
      var peer = res;
      ShowInfo(peer);
    })
    .fail(function (res) { });
  });

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

function ShowInfo(peer)
{
  var wrapper = $('<div class="wrapper fullSize"/>').css('display', 'none');
  var container = $('<div class="dialogContainer centered" style="width: 768px; margin-top: 100px;"/>');
  var titleContainer = $('<div class="dialogTitle"/>').html('Información de ' + peer.nombre + ' ' + peer.apellido);

  //Todos los datos
  var messageContainer = $('<div class="dialogMessage" style="padding: 10px;"/>');

  var nombreApellido = $('<div class="inputWrapper half" style="font-size: 30px"/>').html(peer.nombre + ' ' + peer.apellido);
  var matricula = $('<div class="inputWrapper half"/>')         .html('<div class="infoLabel">Matrícula</div><div class="infoContent">' + peer.matricula.tipo + ': ' + peer.matricula.numero + '</div>');
  var sexo = $('<div class="inputWrapper half"/>')              .html('<div class="infoLabel">Sexo</div><div class="infoContent">' + (peer.sexo == 'F' ? 'Femenino' : 'Masculino') + '</div>');
  var estadoCivil = $('<div class="inputWrapper half"/>')       .html('<div class="infoLabel">Estaddo Civíl</div><div class="infoContent">' + peer.estadoCivil + '</div>');
  var fechaDeNacimiento = $('<div class="inputWrapper half"/>') .html('<div class="infoLabel">Fecha de Nac.</div><div class="infoContent">' + peer.fechaDeNacimiento + '</div>');
  var lugarDeNacimiento = $('<div class="inputWrapper half"/>') .html('<div class="infoLabel">Lugar de Nac.</div><div class="infoContent">' + peer.lugarDeNacimiento + '</div>');
  var email = $('<div class="inputWrapper half"/>')             .html('<div class="infoLabel">Email</div><div class="infoContent">' + peer.email + '</div>');
  var telefono = $('<div class="inputWrapper half"/>')          .html('<div class="infoLabel">Teléfono</div><div class="infoContent">' + peer.telefono + '</div>');
  var profesion = $('<div class="inputWrapper half"/>').html('<div class="infoLabel">Profesión</div><div class="infoContent">' + peer.profesion + '</div>');

  var address = peer.domicilio.calle + ' ' + peer.domicilio.numero + ', ' + peer.domicilio.localidad + ', ' + peer.domicilio.provincia;
  var domicilio = $('<div class="inputWrapper half"/>')         .html('<div class="infoLabel">Domicilio</div><div class="infoContent">' + address + '</div>');
  var map = $('<div class="mapImage" style="background-image:url(https://maps.googleapis.com/maps/api/staticmap?center=' + encodeURIComponent(address + ', Argentina') +
    '&markers=color:0x13BDE8%7Clabel:P%7C' + encodeURIComponent(address + ', Argentina') + '&zoom=16&size=270x270&maptype=roadmap);"/>');


  messageContainer.append(nombreApellido).append(matricula).append(sexo).append(estadoCivil).append(fechaDeNacimiento).append(lugarDeNacimiento).append(email).append(telefono).append(profesion).append(domicilio).append(map);

  var buttonsContainer = $('<div class="dialogFooter"/>');
  var buttonCancel = $('<div class="dialogButton accept"/>').html('Cerrar').click(function () {
    wrapper.fadeOut('200ms', function () {
      wrapper.remove();
    });
  });

  $('body').append(wrapper.append(container.append(titleContainer).append(messageContainer).append(buttonsContainer.append(buttonCancel))));
  wrapper.fadeIn('100ms');
}