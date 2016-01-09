var express = require('express')
var Peer = require('../../lib/models').Peer
var peerForm = require('./form')

var app = express.Router()

app.param('id', function (req, res, next, id) {
  
  Peer.findOne({'_id': id}).exec(function (err, peer) {
    if (err) return res.status(500).send()
    req.peer = peer;
    next();
  })
});

app.get('/admin/peers', function (req, res) {
  Peer.find().exec(function (err, peers) {
    if (err) return res.status(500).send()
    res.render('peers', {
      peers: peers
    })
  })
})

app.get('/admin/peers/new', function (req, res) {
  res.render('peers/new')
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
        '<option value="M" ' + ((req.peer.sexo === 'M')?'selected':'') + '>Masculino</option>';
      },
      formSelectEstadoCivil: function () {
        return '<option value="soltero" ' + ((req.peer.estadoCivil == 'soltero')?'selected':'') + '>Soltero/a</option>' +
        '<option value="casado" ' + ((req.peer.estadoCivil == 'casado')?'selected':'') + '>Casado/a</option>' +
        '<option value="divorciado" ' + ((req.peer.estadoCivil == 'divorciado')?'selected':'') + '>Divorciado/a</option>' +
        '<option value="viudo" ' + ((req.peer.estadoCivil == 'viudo')?'selected':'') + '>Viudo/a</option>'
      }
    }
  });
})

app.post('/admin/peers', peerForm, function (req, res) {
  Peer.create(peerForm, function (err, peer) {
    if (err) return res.status(500).send(err)
    res.redirect('/admin/peers')
  })
})

app.put('/admin/peers/:id', peerForm, function (req, res) {
  req.peer.set(req.form).save(function () {
    res.redirect('/admin/peers')
  })
})

module.exports = app
