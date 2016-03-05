var $ = require('jquery')
var page = require('page')
var content = require('../layout/content')
var template = require('../peers/index.hbs')

page('/admin/peers', content.load, findPeers, function (ctx) {
  var peers = ctx.peers

  var view = $(template({
    peers: sortPeers(peers)
  }))

  ctx.content.append(view)
  loadSearchBoxes(ctx.content)

  // $('.button.info').click(function (ev) {
  //   ev.preventDefault()
  //   ev.stopImmediatePropagation()

  //   var el = $(this).parents('.peerContainer')
  //   var id = $(el).attr('data-id')
  //   // var nombre = $(el).find('.peerNombre').html()
  //   ShowInfo(peers.filter(function (peer) { return peer.id == id })[0])
  // })

  // $('.button.delete').click(function (ev) {
  //   ev.preventDefault()
  //   ev.stopImmediatePropagation()

  //   var el = $(this).parents('.peerContainer')
  //   var id = $(el).attr('data-id')
  //   var nombre = $(el).find('.peerNombre').html()

  //   ShowDialog('Eliminación de Afiliado', '¿Realmente desea eliminar al afiliado <b>' + nombre + '</b>?', function () {
  //     $.del('/admin/api/peers/' + id)
  //     .done(function () {
  //       $(el).slideUp('300', function () { $(this).remove() })
  //       $('#afiliacionesTitle').html('Afiliaciones (' + $('.peerContainer.visible').length + ')')
  //     })
  //     .fail(function (res) { })
  //   })
  // })

  // $('#listType').change(function () {
  //   var val = document.getElementById('listType').value
  //   switch (val) {
  //     case 'todos': $('.peerContainer').addClass('visible').removeClass('hidden') break
  //     case 'todoOk':
  //       $('.peerContainer').each(function (index, item) {
  //         $(item).children('.ok').length == 3 ? $(item).addClass('visible').removeClass('hidden') : $(item).addClass('hidden').removeClass('visible')
  //       })
  //       break
  //     case 'faltanDatos':
  //       $('.peerEstado.datosCompletos.no').parent('.peerContainer').addClass('visible').removeClass('hidden')
  //       $('.peerEstado.datosCompletos.ok').parent('.peerContainer').addClass('hidden').removeClass('visible')
  //       break
  //     case 'faltanFirmas':
  //       $('.peerEstado.tieneFirmas.no').parent('.peerContainer').addClass('visible').removeClass('hidden')
  //       $('.peerEstado.tieneFirmas.ok').parent('.peerContainer').addClass('hidden').removeClass('visible')
  //       break
  //     case 'afiliadoOtroPartido':
  //       $('.peerEstado.noAfiliado.no').parent('.peerContainer').addClass('visible').removeClass('hidden')
  //       $('.peerEstado.noAfiliado.ok').parent('.peerContainer').addClass('hidden').removeClass('visible')
  //       break
  //     default : $('.peerContainer').addClass('visible').removeClass('hidden') break
  //   }
  //   $('#afiliacionesTitle').html('Afiliaciones (' + $('.peerContainer.visible').length + ')')
  // })
})

page.exit('/admin/peers', content.unload)

function findPeers (ctx, next) {
  $.get('/admin/api/peers').done(function (res) {
    ctx.peers = res.map(function (p) {
      p.id = p.id

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

    next()
  })
}

function sortPeers (peers) {
  return peers.sort(function (a, b) {
    return b.apellido !== a.apellido ? (b.apellido <= a.apellido ? 1 : -1) : (b.nombre <= a.nombre ? 1 : -1)
  })
}

function loadSearchBoxes (content) {
  var peerEls = content.find('.peerContainer')

  content.find('.listHeader:not(.actions, .state)').each(function (index, item) {
    var itemEl = $(item)

    itemEl.children().remove()

    var searchButton = $('<div class="button search" />')
    var searchContainer = $('<div class="searchContainer" />').css('display', 'none')
    var searchField = $('<input type="text" class="searchField" />')

    searchField.keyup(function (event) {
      // Si borro todo, muestro todos
      var val = this.value
      if (val === null) {
        peerEls.css('display', 'block')
      } else {
        // Sino, muestro solo los que coincidan con la busqueda
        var field = $(this).parents('.listHeader').attr('data-field')
        $('.peerContainer').each(function (index, item) {
          if (itemEl.find('.peer' + field).html().toLowerCase().indexOf(val.toLowerCase()) >= 0) {
            itemEl.css('display', 'block')
          } else {
            itemEl.css('display', 'none')
          }
        })
      }
    })

    searchContainer.append(searchField)

    searchContainer.append($('<div class="button cancel" />').click(function () {
      searchButton.fadeIn(100)
      searchContainer.fadeOut(100)
      peerEls.css('display', 'block')
    }))

    searchButton.click(function () {
      searchButton.fadeOut(100)
      searchContainer.fadeIn(100)
      searchField.value = ''
      searchField.focus()
    })

    itemEl.append(searchButton)
    itemEl.append(searchContainer)
  })
}
