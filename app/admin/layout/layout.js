var $ = require('jquery')
var toObject = require('form-to-object')
var page = require('page')
var notify = require('notification')
var newTemplate = require('../peers/new.hbs')
var editTemplate = require('../peers/edit.hbs')
var pictures = require('../peers-pictures/peers-pictures')
var content = require('./content')

notify.Notification.effect = 'default'

require('./lib/extend-jquery')

require('../peers/peers')

page('/admin/peers/new', function () {
  $('.content').html('').append(newTemplate({
    obj: {
      peer: {},
      helpers: {
        isNew: true,
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
        formaContactoEmail: function () { return 'checked' },
        formaContactoTelefono: function () { return '' },
        formaContactoDomicilio: function () { return '' }
      }
    }
  }))

  loadEvents()
})

page('/admin/peers/:id/edit', findPeer, content.load, function (ctx, next) {
  var peer = ctx.peer
  var content = ctx.content

  if (peer.fechaDeNacimiento) {
    peer.fechaDeNacimiento = peer.fechaDeNacimiento.split('/').join('-')
  }

  content.append(editTemplate({
    obj: {
      peer: peer,
      helpers: {
        isNew: false,
        formSelectTipoMatricula: function () {
          return '<option value="DNI" ' + ((peer.matricula.tipo === 'DNI') ? 'selected' : '') + '>DNI</option>' +
            '<option value="LE" ' + ((peer.matricula.tipo === 'LE') ? 'selected' : '') + '>LE</option>' +
            '<option value="LI" ' + ((peer.matricula.tipo === 'LI') ? 'selected' : '') + '>LI</option>'
        },
        formSelectSexo: function () {
          return '<option value="F" ' + (peer.sexo === 'F' ? 'selected' : '') + '>Femenino</option>' +
            '<option value="M" ' + (peer.sexo === 'M' ? 'selected' : '') + '>Masculino</option>'
        },
        formSelectEstadoCivil: function () {
          return '<option value="soltero" ' + (peer.estadoCivil === 'soltero' ? 'selected' : '') + '>Soltero/a</option>' +
            '<option value="casado" ' + (peer.estadoCivil === 'casado' ? 'selected' : '') + '>Casado/a</option>' +
            '<option value="divorciado" ' + (peer.estadoCivil === 'divorciado' ? 'selected' : '') + '>Divorciado/a</option>' +
            '<option value="viudo" ' + (peer.estadoCivil === 'viudo' ? 'selected' : '') + '>Viudo/a</option>'
        },
        tieneFirmasSi: function () { return peer.tieneFirmas != null ? (peer.tieneFirmas === true ? 'checked' : '') : '' },
        tieneFirmasNo: function () { return peer.tieneFirmas != null ? (!peer.tieneFirmas === true ? 'checked' : '') : '' },
        tieneFirmasCancel: function () { return peer.tieneFirmas != null ? 'block' : 'none' },
        afiliadoOtroPartidoSi: function () { return peer.noAfiliadoOtroPartido != null ? (peer.noAfiliadoOtroPartido === false ? 'checked' : '') : '' },
        afiliadoOtroPartidoNo: function () { return peer.noAfiliadoOtroPartido != null ? (!peer.noAfiliadoOtroPartido === false ? 'checked' : '') : '' },
        afiliadoOtroPartidoCancel: function () { return peer.noAfiliadoOtroPartido != null ? 'block' : 'none' },
        deseaAyudarSi: function () { return peer.deseaAyudar != null ? (peer.deseaAyudar === true ? 'checked' : '') : '' },
        deseaAyudarNo: function () { return peer.deseaAyudar != null ? (!peer.deseaAyudar === true ? 'checked' : '') : '' },
        deseaAyudarCancel: function () { return peer.deseaAyudar != null ? 'block' : 'none' },
        formaContactoEmail: function () { return peer.formaContacto === 'Email' ? 'checked' : '' },
        formaContactoTelefono: function () { return peer.formaContacto === 'Telefono' ? 'checked' : '' },
        formaContactoDomicilio: function () { return peer.formaContacto === 'Domicilio' ? 'checked' : '' }
      }
    }
  }))

  loadEvents()
})

page()

function findPeer (ctx, next) {
  $.get('/admin/api/peers/' + ctx.params.id)
    .done(function (res) {
      ctx.peer = res
      next()
    })
}

function loadEvents () {
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
      return window.alert('La foto es muy pesada, el tamaño máximo es 10MB.')
    } else {
      var reader = new window.FileReader()
      reader.onload = function (e) {
        $('#' + input.name + '-preview').css('background-image', 'url(' + e.target.result + ')')
        $($(input).parents('.inputWrapper')[0]).children('.cancelSelection').css('display', 'block')
      }
      reader.readAsDataURL(file)
    }
  })

  $('#btnCancelPicture1').on('click', function (evt) {
    $('#picture-1-preview').css('background-image', '')
    $('#picture-1').val('')
    $(evt.currentTarget).css('display', 'none')
  })
  $('#btnCancelPicture2').on('click', function (evt) {
    $('#picture-2-preview').css('background-image', '')
    $('#picture-2').val('')
    $(evt.currentTarget).css('display', 'none')
  })
  $('#btnCancelPicture3').on('click', function (evt) {
    $('#picture-3-preview').css('background-image', '')
    $('#picture-3').val('')
    $(evt.currentTarget).css('display', 'none')
  })

  $('input[type=radio]').on('change', function (evt) {
    var radio = evt.target
    $('#btnCancel' + radio.name).css('display', 'block')
  })

  $('#btnCanceltieneFirmas').on('click', function (evt) {
    $('input[name=tieneFirmas]').attr('checked', false)
    $(evt.target).css('display', 'none')
  })
  $('#btnCancelafiliadoOtroPartido').on('click', function (evt) {
    $('input[name=afiliadoOtroPartido]').attr('checked', false)
    $(evt.target).css('display', 'none')
  })
  $('#btnCanceldeseaAyudar').on('click', function (evt) {
    $('input[name=deseaAyudar]').attr('checked', false)
    $(evt.target).css('display', 'none')
  })

  $('#btnCancelEdit').on('click', function (evt) {
    window.location = '/admin/peers'
  })
}

function SaveData () {
  $('.errorList').slideUp('50', function () {
    $('.errorList').html('')

    var form = toObject(document.querySelector('form'))
    var action = form.id ? 'put' : 'post'

    $[action]('/admin/api/peers/' + form.id, form).done(function (res) {
      notify('Par guardado.')
      UploadImages(res, function () {
        notify('Imágenes guardadas.')
      })
    }).fail(function (res) {
      notify.error('No se pudo guardar, por favor revise los errores.')
      showErrors($.parseJSON(res.responseText))
    })
  })
}

function UploadImages (peer, cb) {
  var imagenes = []

  $('.imagenDocumento').each(function (index, item) {
    var file = item.files[0]
    if (file) {
      if (file.size <= 10000000) {
        imagenes.push(item)
      }
    }
  })

  if (!imagenes.length) return cb()

  var i = 0
  imagenes.forEach(function (item) {
    var file = item.files[0]
    pictures.getUploadUrl(peer.id, file).done(function (resDir) {
      console.log('UploadUrl: ', resDir)
      pictures.upload(file, resDir.uploadUrl)
      .progress(function (data) {
        console.log('progess: ', data)
      })
      .done(function (res) {
        i++
        console.log('done: ', res)
        if (!peer.imagenesDocumento) {
          peer.imagenesDocumento = {}
        }
        if (item.name === 'picture-1') peer.imagenesDocumento.frente = resDir.file
        else if (item.name === 'picture-2') peer.imagenesDocumento.dorso = resDir.file
        else if (item.name === 'picture-3') peer.imagenesDocumento.cambioDomicilio = resDir.file

        if (i === imagenes.length) {
          $.put('/admin/api/peers/' + peer.id + '/pictures', peer.imagenesDocumento)
            .done(function (res) {
              window.location = '/admin/peers'
            })
            .fail(function (res) {
              showErrors($.parseJSON(res.responseText))
            })
        }
      })
      .fail(function (err) {
        i++
        console.log('fail: ', err)
      })
    })
    .fail(function (err) {
      console.error(err)
      window.alert('No se pudieron guardar las imágenes.')
    })
  })
}

function showErrors (err) {
  $(err.errors).each(function (index, error) {
    $(Object.keys(error)).each(function (index, item) {
      $('.errorList').append($('<div class="errorItem" />').html(error[item].message))
    })
  })

  $('.errorList').slideDown('50')
}
