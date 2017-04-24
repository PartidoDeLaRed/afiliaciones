var express = require('express')
var Peer = require('../../shared/models').Peer

var app = express.Router()

app.get('/api/peers/count', function (req, res) {
  Peer.find().count().exec(function (err, count) {
    if (err) {
      return res.status(500).end()
    }

    res.status(200).json(count)
  })
})

app.get('/api/peers', function (req, res) {
  Peer.find({deletedAt: null},{deletedAt:0, createdAt:0, createdBy:0, updatedAt:0, lastEditedBy:0, borrado:0, _id:0}).exec(function (err, peers) {
    if (err) return res.status(500).send(err)

    peers = peers.map(function (p) {
      p = JSON.parse(JSON.stringify(p))
      try {
        p.datosCompletos = (
          p.nombre != null &&
          p.apellido != null &&
          p.matricula.numero != null &&
          p.sexo != null &&
          p.estadoCivil != null &&
          p.lugarDeNacimiento != null &&
          p.fechaDeNacimiento != null &&
          p.profesion != null &&
          p.domicilio.calle != null &&
          p.domicilio.numero != null
        )
      } catch (e) {
        p.datosCompletos = false
      }
      p.tieneFotos = !!p.imagenesDocumento

      delete p.telefono
      delete p.email
      delete p.sexo
      delete p.estadoCivil
      delete p.lugarDeNacimiento
      delete p.fechaDeNacimiento
      delete p.profesion
      delete p.domicilio
      delete p.imagenesDocumento
      delete p.mismoDomicilioDocumento

      return p
    })

    res.status(200).jsonp(peers)
  })
})

module.exports = app
