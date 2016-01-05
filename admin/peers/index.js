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
    appellido: req.body.appellido,
    email: req.body.email
  }, function (err, peer) {
    if (err) return res.status(500).send(err)
    res.redirect('/admin/peers')
  })
})

module.exports = app
