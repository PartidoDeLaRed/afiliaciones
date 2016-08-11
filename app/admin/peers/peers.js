var $ = require('jquery')
var page = require('page')
var content = require('../layout/content')
var template = require('./index.hbs')
var infoTemplate = require('./info.hbs')
var dialogTemplate = require('./dialog.hbs')

page('/admin/peers', content.load, findPeers, function (ctx) {
  var peers = ctx.peers

  var view = $(template({
    peers: parsePeers(peers),
    slugify: slugify
  }))

  ctx.content.append(view)

  // Info Modal
  ctx.content.on('click', '.button.info', function (evt) {
    evt.preventDefault()
    evt.stopImmediatePropagation()

    var el = $(this).parents('.peerContainer')
    var id = $(el).attr('data-id')

    showInfo(peers.find(function (peer) { return peer.id === id }))
  })

  // Delete Modal
  ctx.content.on('click', '.button.delete', function (evt) {
    evt.preventDefault()
    evt.stopImmediatePropagation()

    var el = $(this).parents('.peerContainer')
    var id = $(el).attr('data-id')
    var nombre = $(el).find('.peerNombre').html()

    showDialog('Eliminación de Afiliado', '¿Realmente desea eliminar al afiliado <b>' + nombre + '</b>?', function () {
      $.del('/admin/api/peers/' + id).done(function () {
        $(el).slideUp('300', function () { $(this).remove() })
        $('#afiliacionesTitle').html('Afiliaciones (' + $('.peerContainer:visible').length + ')')
      }).fail(console.error.bind(console))
    })
  })

  $('#listType').change(function () {
    var val = document.getElementById('listType').value
    switch (val) {
      case 'todos': $('.peerContainer').addClass('visible').removeClass('hidden')
        break
      case 'todoOk':
        $('.peerContainer').addClass('hidden').filter('.tieneFotos').each(function (index, item) {
          $(item).children('.ok').length === 3 ? $(item).addClass('visible').removeClass('hidden') : $(item).removeClass('visible')
        })
        break
      case 'faltanDatos':
        $('.peerEstado.datosCompletos.no').parent('.peerContainer').addClass('visible').removeClass('hidden')
        $('.peerEstado.datosCompletos.ok').parent('.peerContainer').addClass('hidden').removeClass('visible')
        break
      case 'faltanFirmas':
        $('.peerEstado.tieneFirmas.no').parent('.peerContainer').addClass('visible').removeClass('hidden')
        $('.peerEstado.tieneFirmas.ok').parent('.peerContainer').addClass('hidden').removeClass('visible')
        break
      case 'faltanFotos':
        $('.peerContainer').addClass('hidden').filter('.faltanFotos').removeClass('hidden').addClass('visible')
        break
      case 'afiliadoOtroPartido':
        $('.peerEstado.noAfiliado.no').parent('.peerContainer').addClass('visible').removeClass('hidden')
        $('.peerEstado.noAfiliado.ok').parent('.peerContainer').addClass('hidden').removeClass('visible')
        break
      default: $('.peerContainer').addClass('visible').removeClass('hidden')
    }
    $('#afiliacionesTitle').html('Afiliaciones (' + $('.peerContainer:visible').length + ')')
  })

  loadSearchBoxes(ctx.content)
  $('.spinnerContainer').hide();
})

page.exit('/admin/peers', content.unload)

function findPeers (ctx, next) {
  $.get('/admin/api/peers').done(function (res) {
    ctx.peers = res.map(function (p) {
      try {
        p.datosCompletos = (
          p.nombre &&
          p.apellido &&
          // p.email &&
          p.matricula.numero &&
          // p.matricula.tipo &&
          p.sexo &&
          p.estadoCivil &&
          p.lugarDeNacimiento &&
          p.fechaDeNacimiento &&
          p.profesion &&
          p.domicilio.calle &&
          p.domicilio.numero &&
          // p.domicilio.codPostal &&
          // p.domicilio.localidad &&
          // p.domicilio.provincia &&
          // (
          //   p.mismoDomicilioDocumento !== true
          //   ? (
          //     p.domicilioReal.calle &&
          //     p.domicilioReal.numero &&
          //     p.domicilioReal.piso &&
          //     p.domicilioReal.depto &&
          //     p.domicilioReal.codPostal &&
          //     p.domicilioReal.localidad &&
          //     p.domicilioReal.provincia
          //   ) : true
          // )
          true
        )
      } catch (e) {
        p.datosCompletos = false
      }

      p.tieneFotos = !!p.imagenesDocumento

      return p
    })

    next()
  })
}

function parsePeers (peers) {
  return peers.map(function (peer) {
    return Object.assign({}, peer, {
      nombreSlug: slugify(peer.apellido + ' ' + peer.nombre),
      emailSlug: slugify(peer.email)
    })
  }).sort(function (a, b) {
    return b.apellido !== a.apellido ? (b.apellido <= a.apellido ? 1 : -1) : (b.nombre <= a.nombre ? 1 : -1)
  })
}

function slugify (text) {
  return (text || '').toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')            // Trim - from end of text
}

function loadSearchBoxes (content) {
  content.find('[data-field]').each(function (index, item) {
    var itemEl = $(item)
    var field = itemEl.attr('data-field')
    var style = $('<style/>')

    itemEl.children().remove()

    var searchButton = $('<div class="button search" />')
    var searchContainer = $('<div class="searchContainer" />').css('display', 'none')
    var searchField = $('<input type="text" class="searchField" />')

    var itemSelector = 'data-field-' + field

    searchField.keyup(function (event) {
      var val = slugify(searchField.val())

      if (!val) return style.html('')

      style.html([
        '[' + itemSelector + ']{display:none}',
        '[' + itemSelector + '][' + itemSelector + '*="' + val + '"]{display:block}'
      ].join(''))
    })

    searchContainer.append(searchField)
    searchContainer.append(style)

    searchContainer.append($('<div class="button cancel" />').click(function () {
      searchButton.fadeIn(100)
      searchContainer.fadeOut(100)
      style.html('')
      searchField.val('')
    }))

    searchButton.click(function () {
      searchButton.fadeOut(100)
      searchContainer.fadeIn(100)
      searchField.focus()
    })

    itemEl.append(searchButton)
    itemEl.append(searchContainer)
  })
}

function showInfo (peer) {
  var domicilio = getPrettyAddress(peer.domicilio)

  var data = {
    peer: peer,
    nombreCompleto: [peer.nombre, peer.apellido].join(' '),
    sexo: peer.sexo === 'F' ? 'Femenino' : 'Masculino',
    domicilio: domicilio,
    mapa: getGoogleMapsImage(domicilio + ', Argentina')
  }

  var view = $(infoTemplate(data))

  view.on('click', '[data-close]', view.remove.bind(view, undefined))

  view.appendTo(document.body)

  return view
}

function getGoogleMapsImage (address) {
  address = encodeURIComponent(address)
  return 'https://maps.googleapis.com/maps/api/staticmap?center=' +
    address + '&markers=color:0x13BDE8%7Clabel:P%7C' +
    address + '&zoom=16&size=270x270&maptype=roadmap&key=AIzaSyAVJj-kWmMjQBZA5pN3BqCdHY4pUYZ-Kmo'
}

function getPrettyAddress (address) {
  if (!address) return ''
  return address.calle +
    ' ' + address.numero +
    ', Buenos Aires, Argentina'
}

function showDialog (title, message, cb) {
  var data = {
    title: title,
    message: message
  }

  var view = $(dialogTemplate(data))

  view.on('click', '[data-accept]', cb.bind(cb, view))

  view.on('click', '[data-accept], [data-close]', view.remove.bind(view, undefined))

  view.appendTo(document.body)

  return view
}
