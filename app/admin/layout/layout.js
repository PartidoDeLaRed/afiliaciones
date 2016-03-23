var $ = require('jquery')
var toObject = require('form-to-object')
var page = require('page')
var listTemplate = require('../peers/index.hbs')
var newTemplate = require('../peers/new.hbs')
var editTemplate = require('../peers/edit.hbs')
var pictures = require('../peers-pictures/peers-pictures')

require('./lib/extend-jquery')

var peers = null

function findPeer (ctx, next) {
  $.get('/admin/api/peers/' + ctx.params.id)
    .done(function (res) {
      ctx.peer = res
      next()
    })
}

var _content
function loadContent (ctx, next) {
  if (!_content) _content = $('.content')
  _content.html('') // Limpiar el content
  _content.off() // Desatachear todos los eventos de la vista anterior
  ctx.content = _content
  next()
}

page('/admin/peers', function () {
  $.get('/admin/api/peers').done(function (res) {
    peers = res.map(function (p) {
      p.id = p.id;

      try {
        p.datosCompletos = (
          p.nombre &&
          p.apellido &&
          p.email &&
          p.matricula.numero &&
          p.matricula.tipo &&
          p.sexo &&
          p.estadoCivil &&
          p.lugarDeNacimiento &&
          p.fechaDeNacimiento &&
          p.profesion &&
          p.domicilio.calle &&
          p.domicilio.numero &&
          p.domicilio.codPostal &&
          p.domicilio.localidad &&
          p.domicilio.provincia &&
          (p.mismoDomicilioDocumento !== true ?
            (p.domicilioReal.calle &&
            p.domicilioReal.numero &&
            p.domicilioReal.piso &&
            p.domicilioReal.depto &&
            p.domicilioReal.codPostal &&
            p.domicilioReal.localidad &&
            p.domicilioReal.provincia) : true)
        )
      } catch (e) {
        p.datosCompletos = false
      }

      return p
    })

    $('.content').html('').append(listTemplate({ peers: peers.sort(function (a, b) { return (b.apellido != a.apellido ? (b.apellido <= a.apellido ? 1 : -1) : (b.nombre <= a.nombre ? 1 : -1)) }) }));
    loadSearchBoxes();

    $('.button.info').click(function (ev) {
      ev.preventDefault();
      ev.stopImmediatePropagation();

      var el = $(this).parents('.peerContainer');
      var id = $(el).attr('data-id');
      // var nombre = $(el).find('.peerNombre').html();
      ShowInfo(peers.filter(function (peer) { return peer.id == id })[0]);
    });

    $('.button.delete').click(function (ev) {
      ev.preventDefault();
      ev.stopImmediatePropagation();

      var el = $(this).parents('.peerContainer');
      var id = $(el).attr('data-id');
      var nombre = $(el).find('.peerNombre').html();

      ShowDialog('Eliminaci�n de Afiliado', '�Realmente desea eliminar al afiliado <b>' + nombre + '</b>?', function () {
        $.del('/admin/api/peers/' + id)
        .done(function () {
          $(el).slideUp('300', function () { $(this).remove(); })
          $('#afiliacionesTitle').html('Afiliaciones (' + $('.peerContainer.visible').length + ')')
        })
        .fail(function (res) { });
      });
    });

    $('#listType').change(function () {
      var val = document.getElementById('listType').value;
      switch (val) {
        case 'todos': $('.peerContainer').addClass('visible').removeClass('hidden'); break;
        case 'todoOk':
          $('.peerContainer').each(function (index, item) {
            $(item).children('.ok').length == 3 ? $(item).addClass('visible').removeClass('hidden') : $(item).addClass('hidden').removeClass('visible');
          });
          break;
        case 'faltanDatos':
          $('.peerEstado.datosCompletos.no').parent('.peerContainer').addClass('visible').removeClass('hidden');
          $('.peerEstado.datosCompletos.ok').parent('.peerContainer').addClass('hidden').removeClass('visible');
          break;
        case 'faltanFirmas':
          $('.peerEstado.tieneFirmas.no').parent('.peerContainer').addClass('visible').removeClass('hidden');
          $('.peerEstado.tieneFirmas.ok').parent('.peerContainer').addClass('hidden').removeClass('visible');
          break;
        case 'afiliadoOtroPartido':
          $('.peerEstado.noAfiliado.no').parent('.peerContainer').addClass('visible').removeClass('hidden');
          $('.peerEstado.noAfiliado.ok').parent('.peerContainer').addClass('hidden').removeClass('visible');
          break;
        default : $('.peerContainer').addClass('visible').removeClass('hidden'); break;
      }
      $('#afiliacionesTitle').html('Afiliaciones (' + $('.peerContainer.visible').length + ')');
    });
  })
     .fail(function (res) {
    showErrors($.parseJSON(res.responseText));
  });

});

page('/admin/peers/new', function () {
  $('.content').html('').append(newTemplate({
    obj: {
      peer: {},
      helpers: {
        formSelectTipoMatricula: function () {
          return '<option value="DNI">DNI</option>' +
          '<option value="LE">LE</option>' +
          '<option value="LI">LI</option>'
        },
        formSelectSexo: function () {
          return '<option value="F">Femenino</option>' +
          '<option value="M">Masculino</option>'
        },
        formSelectEstadoCivil: function () {
          return '<option value="soltero">Soltero/a</option>' +
          '<option value="casado">Casado/a</option>' +
          '<option value="divorciado">Divorciado/a</option>' +
          '<option value="viudo">Viudo/a</option>'
        },
        formaContactoEmail: function(){ return 'checked' },
        formaContactoTelefono: function () { return '' },
        formaContactoDomicilio: function () { return '' }
      }
    }
  }));

  loadEvents();
});

page('/admin/peers/:id/edit', findPeer, loadContent, function (ctx, next) {
  var peer = ctx.peer
  var content = ctx.content

  if (peer.fechaDeNacimiento) {
    peer.fechaDeNacimiento = peer.fechaDeNacimiento.split('/').join('-')
  }

  content.append(editTemplate({
    obj: {
      peer: peer,
      helpers: {
        formSelectTipoMatricula: function () {
          return '<option value="DNI" ' + ((peer.matricula.tipo == 'DNI')?'selected':'') + '>DNI</option>' +
      '<option value="LE" ' + ((peer.matricula.tipo == 'LE')?'selected':'') + '>LE</option>' +
      '<option value="LI" ' + ((peer.matricula.tipo == 'LI')?'selected':'') + '>LI</option>'
        },
        formSelectSexo: function () {
          return '<option value="F" ' + ((peer.sexo === 'F')?'selected':'') + '>Femenino</option>' +
      '<option value="M" ' + ((peer.sexo === 'M')?'selected':'') + '>Masculino</option>'
        },
        formSelectEstadoCivil: function () {
          return '<option value="soltero" ' + ((peer.estadoCivil == 'soltero')?'selected':'') + '>Soltero/a</option>' +
      '<option value="casado" ' + ((peer.estadoCivil == 'casado')?'selected':'') + '>Casado/a</option>' +
      '<option value="divorciado" ' + ((peer.estadoCivil == 'divorciado')?'selected':'') + '>Divorciado/a</option>' +
      '<option value="viudo" ' + ((peer.estadoCivil == 'viudo')?'selected':'') + '>Viudo/a</option>'
        },
        formaContactoEmail: function () { return peer.formaContacto == "Email" ? 'checked' : '' },
        formaContactoTelefono: function () { return peer.formaContacto == "Telefono" ? 'checked' : '' },
        formaContactoDomicilio: function () { return peer.formaContacto == "Domicilio" ? 'checked' : '' },
        deseaAyudarSi: function () { return peer.deseaAyudar ? 'checked' : '' },
        deseaAyudarNo: function () { return !peer.deseaAyudar ? 'checked' : '' }
      }
    }
  }))

  loadEvents();
})

page()

function loadEvents()
{
  $('#peerForm').on('submit', function (ev) {
    ev.preventDefault()
    ev.stopImmediatePropagation()
    SaveData()
    return false
  })

  $('#mismoDomicilioDocumento').on('change', function (evt) {
    var input = evt.currentTarget
    var action = input.checked ? 'slideUp' : 'slideDown'
    $('#sectionDomicilioReal')[action]('100')
  })

  $('.imagenDocumento').on('change', function (evt) {
    var input = evt.currentTarget
    var file = input.files[0]
    if (!file) return
    if (file.size > 10000000) {
      input.value = ''
      return window.alert('La foto es muy pesada, el tama�o m�ximo es 10MB.')
    } else {
      var reader = new window.FileReader()
      reader.onload = function (e) {
        $('#' + input.name + '-preview').css('background-image', 'url(' + e.target.result + ')')
      }
      reader.readAsDataURL(file)
    }
  })
}

function loadSearchBoxes () {
  $('.listHeader:not(.actions, .state)').each(function (index, item) {
    $(item).children().remove();

    var searchButton = $('<div class="button search" />')

    var searchContainer = $('<div class="searchContainer" />').css('display', 'none');
    var searchField = $('<input type="text" class="searchField" />')
    searchContainer.append(searchField.keyup(function (event) {
      //Si borro todo, muestro todos
      var val = this.value;
      if (val === null) {
        $('.peerContainer').css('display', 'block');
      }
      //Sino, muestro solo los que coincidan con la busqueda
      else {
        var field = $(this).parents('.listHeader').attr('data-field');
        $('.peerContainer').each(function (index, item) {
          if ($(item).find('.peer' + field).html().toLowerCase().indexOf(val.toLowerCase()) >= 0)
            $(item).css('display', 'block');
          else
            $(item).css('display', 'none');
        })
      }
    })
    );
    searchContainer.append($('<div class="button cancel" />').click(function () {
      searchButton.fadeIn(100)
      searchContainer.fadeOut(100)
      $('.peerContainer').css('display', 'block');
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

    if (form.id) {
      $.put('/admin/api/peers/' + form.id, form)
      .done(function (res) { UploadImages(res, function () { window.location = '/admin/peers'; }); })
      .fail(function (res) { showErrors($.parseJSON(res.responseText)); });
    }
    else {
      $.post('/admin/api/peers/', form)
      .done(function (res) { UploadImages(res, function () { window.location = '/admin/peers'; }); })
      .fail(function (res) { showErrors($.parseJSON(res.responseText)); });
    }
  });
}

function UploadImages(peer, cb) {
  var save = false;
  var imagenes = [];
  $('.imagenDocumento').each(function (index, item) {
    var file = item.files[0]
    if (file)
      if (file.size <= 10000000)
        imagenes.push(item);
  });
  var i = 0;
  imagenes.forEach(function (item) {
    var file = item.files[0]
    pictures.getUploadUrl(peer.id, file)
    .done(function (resDir) {
      console.log('UploadUrl: ', resDir)
      pictures.upload(file, resDir.uploadUrl)
      .progress(function (data) {
        console.log('progess: ', data)
      })
      .done(function (res) {
        i++;
        console.log('done: ', res)
        save = true;
        if (!peer.imagenesDocumento)
          peer.imagenesDocumento = {};
        if (item.name == 'picture-1') peer.imagenesDocumento.frente = resDir.file;
        else if (item.name == 'picture-2') peer.imagenesDocumento.dorso = resDir.file;
        else if (item.name == 'picture-3') peer.imagenesDocumento.cambioDomicilio = resDir.file;

        if (i == imagenes.length)
          $.put('/admin/api/peers/' + peer.id + '/pictures', peer.imagenesDocumento)
          .done(function (res) {
            window.location = '/admin/peers';
          })
          .fail(function (res) {
            showErrors($.parseJSON(res.responseText));
          });
      })
      .fail(function (err) {
        i++;
        console.log('fail: ', err)
      })
    })
    .fail(function (err) {
      console.error(err)
    })
  })

  if (save) {

  }
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
    wrapper.fadeOut('200ms', function () {
      wrapper.remove();
      cb();
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
  var titleContainer = $('<div class="dialogTitle"/>').html('Informaci�n de ' + peer.nombre + ' ' + peer.apellido);

  //Todos los datos
  var messageContainer = $('<div class="dialogMessage" style="padding: 10px;"/>');
  var nombreApellido = $('<div class="inputWrapper half" style="font-size: 30px"/>').html(peer.nombre + ' ' + peer.apellido);
  var matricula = $('<div class="inputWrapper half"/>')         .html('<div class="infoLabel">Matr�cula</div><div class="infoContent">' + peer.matricula.tipo + ': ' + peer.matricula.numero + '</div>');
  var sexo = $('<div class="inputWrapper half"/>')              .html('<div class="infoLabel">Sexo</div><div class="infoContent">' + (peer.sexo == 'F' ? 'Femenino' : 'Masculino') + '</div>');
  var estadoCivil = $('<div class="inputWrapper half"/>')       .html('<div class="infoLabel">Estado Civil</div><div class="infoContent">' + peer.estadoCivil + '</div>');
  var fechaDeNacimiento = $('<div class="inputWrapper half"/>') .html('<div class="infoLabel">Fecha de Nac.</div><div class="infoContent">' + peer.fechaDeNacimiento + '</div>');
  var lugarDeNacimiento = $('<div class="inputWrapper half"/>') .html('<div class="infoLabel">Lugar de Nac.</div><div class="infoContent">' + peer.lugarDeNacimiento + '</div>');
  var email = $('<div class="inputWrapper half"/>')             .html('<div class="infoLabel">Email</div><div class="infoContent">' + peer.email + '</div>');
  var telefono = $('<div class="inputWrapper half"/>')          .html('<div class="infoLabel">Tel�fono</div><div class="infoContent">' + peer.telefono + '</div>');
  var profesion = $('<div class="inputWrapper half"/>').html('<div class="infoLabel">Profesi�n</div><div class="infoContent">' + peer.profesion + '</div>');

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