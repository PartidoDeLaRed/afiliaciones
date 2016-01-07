var express = require('express')
var Peer = require('../../lib/models').Peer

var app = express.Router()

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

app.post('/admin/peers', function (req, res) {
  Peer.create({
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    matricula: {
      tipo: req.body.matricula_tipo,
      numero: req.body.matricula_numero
    },
    fechaDeNacimiento: req.body.fechaNacimiento,
    lugarDeNacimiento: req.body.lugarNacimiento,
    sexo: req.body.sexo,
    estadoCivil: req.body.estadoCivil,
    email: req.body.email,
    telefono: req.body.telefono,
    profesion: req.body.profesion,
    domicilio: {
      calle: req.body.domicilioDoc_calle,
      numero: req.body.domicilioDoc_numero,
      piso: req.body.domicilioDoc_piso,
      depto: req.body.domicilioDoc_depto,
      codPostal: req.body.domicilioDoc_codPostal,
      localidad: req.body.domicilioDoc_localidad,
      provincia: req.body.domicilioDoc_provincia
    },
    domicilioReal: {
      calle: req.body.domicilioReal_calle,
      numero: req.body.domicilioReal_numero,
      piso: req.body.domicilioReal_piso,
      depto: req.body.domicilioReal_depto,
      codPostal: req.body.domicilioReal_codPostal,
      localidad: req.body.domicilioReal_localidad,
      provincia: req.body.domicilioReal_provincia
    }
  }, function (err, peer) {
    if (err) return res.status(500).send(err)
    res.redirect('/admin/peers')
  })
})

module.exports = app
