var express = require('express')
var bodyParser = require('body-parser')
var Peer = require('../../lib/models').Peer
var peerForm = require('./form')

var app = express.Router()

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.param('id', function (req, res, next, id) {
  Peer.findOne({'_id': id}).exec(function (err, peer) {
    if (err) return res.status(500).send()
    req.peer = peer
    next()
  })
})

app.get('/admin/peers', function (req, res) {
  Peer.find().exec(function (err, peers) {
    if (err) return res.status(500).send()
    res.render('peers', {
      peers: peers
    })
  })
})

app.get('/admin/peers/new', function (req, res) {
  res.render('peers/new', {
    peer: new Peer(),
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
      }
    }
  })
})

app.get('/admin/peers/:id/edit', function (req, res) {
  res.render('peers/edit', {
    peer: req.peer,
    helpers: {
      formSelectTipoMatricula: function () {
        return '<option value="DNI" ' + ((req.peer.matricula.tipo == 'DNI')?'selected':'') + '>DNI</option>' +
        '<option value="LE" ' + ((req.peer.matricula.tipo == 'LE')?'selected':'') + '>LE</option>' +
        '<option value="LI" ' + ((req.peer.matricula.tipo == 'LI')?'selected':'') + '>LI</option>'
      },
      formSelectSexo: function () {
        return '<option value="F" ' + ((req.peer.sexo === 'F')?'selected':'') + '>Femenino</option>' +
        '<option value="M" ' + ((req.peer.sexo === 'M')?'selected':'') + '>Masculino</option>'
      },
      formSelectEstadoCivil: function () {
        return '<option value="soltero" ' + ((req.peer.estadoCivil == 'soltero')?'selected':'') + '>Soltero/a</option>' +
        '<option value="casado" ' + ((req.peer.estadoCivil == 'casado')?'selected':'') + '>Casado/a</option>' +
        '<option value="divorciado" ' + ((req.peer.estadoCivil == 'divorciado')?'selected':'') + '>Divorciado/a</option>' +
        '<option value="viudo" ' + ((req.peer.estadoCivil == 'viudo')?'selected':'') + '>Viudo/a</option>'
      }
    }
  })
})

app.get('/admin/peers/:id/delete', function (req, res) {
  req.peer.remove( function (err, offer) {
    if (err) return res.status(500).send(err)
    res.redirect('/admin/peers')
  })
})

app.post('/admin/peers', peerForm, function (req, res) {
  Peer.create(req.peer, function (err, peer) {
    if (err) return res.status(500).send(err)
    res.send('ok');
  })
})

app.put('/admin/peers/:id', peerForm, function (req, res) {
  req.peer.save(function () {
    res.send('ok');
  })
})

module.exports = app
