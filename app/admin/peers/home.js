var $ = require('jquery')
var page = require('page')
var content = require('../layout/content')
var dateFormat = require('dateformat')
var homeAdminTemplate = require('./home.hbs')
var emailTemplate = require('./email.hbs')
var dialogTemplate = require('./dialog.hbs')

dateFormat.masks.onlyDate = 'dd/mm/yyyy';

page('/admin/home', content.load, findLastPeers, function (ctx, req) {

  var peers = parsePeers(ctx.peers);
  var groups = onlyUniqueDates(peers.map(function(p){return {date:dateFormat(p.createdAt,'onlyDate'), dateString: dateFormat(p.createdAt, 'isoDateTime')}}))
    .map(function(g){return {date: g.date, dateString: FechaATexto(g.dateString), peers: peers.filter(function(p){return p.formatedDate == g.date})}})
    .sort(function (a, b) {
      return Date.parse(b.date) !== Date.parse(a.date) ? (Date.parse(b.date) <= Date.parse(a.date) ? -1 : 1) : 1
    });

  var view = $(homeAdminTemplate({
    peers: peers,
    groups: groups
  }))

  ctx.content.append(view)

  // Email Modal
  ctx.content.on('click', '.button.mail', function (evt) {
    evt.preventDefault()
    evt.stopImmediatePropagation()

    var el = $(this).parents('.peerContainer')
    var id = $(el).attr('data-id')

    showEmail(peers.find(function (peer) { return peer.id === id }))
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
})

page.exit('/admin/home', content.unload)

function showEmail (peer) {
  var data = {
    peer: peer,
    nombreCompleto: [peer.nombre, peer.apellido].join(' ')
  }
  var view = $(emailTemplate(data))
  view.on('submit', '#form-email', function(evt){
    evt.preventDefault()
    evt.stopPropagation()

    var data = $(this).serializeArray();
/* Mandar el mail con un template
    res.render('emails/mail-afiliado', data, function (err, html) {
      if (err) {
        console.error(err)
        return
      }

      mailer.sendMail({
        from: config.mailer.sender.name,
        to: data.email,
        subject: data.asunto,
        html: html
      }, function (err, info) {
        if (err) {
          console.error(err)
        } else {
          console.log('Mail "emails/mail-afiliado" sent with data: ', data)
        }
      })
    })
*/
    view.remove.bind(view, undefined)
  })
  view.on('click', '[data-close]', view.remove.bind(view, undefined))
  view.appendTo(document.body)
  return view
}

function findLastPeers (ctx, next) {
  $.get('/admin/api/lastPeers', {days: 30}).done(function (res) {
    ctx.peers = res.map(function (p) {
      p.datosCompletos = false
      return p
    })
    next()
  })
}

function onlyUniqueDates(array) {
  var distinct = [];
  array.forEach(function(el) {
    if(distinct.filter(function(d){return d.date == el.date}).length == 0)
      distinct.push(el);
  });
  return distinct;
}

function FechaATexto(date) {
  var today = new Date().setHours(0,0,0,0);
  var dif = Math.abs(today - new Date(date).setHours(0,0,0,0));
  if(dif == 0)
    return 'Hoy';
  else if(dif == 1*1000*60*60*24)
    return 'Ayer';
  else return dateFormat(date, 'onlyDate')
}

function parsePeers (peers) {
  return peers.map(function (peer) {
    return Object.assign({}, peer, {
      nombreSlug: slugify(peer.apellido + ' ' + peer.nombre),
      emailSlug: slugify(peer.email),
      formatedDate: dateFormat(peer.createdAt, 'onlyDate')
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
