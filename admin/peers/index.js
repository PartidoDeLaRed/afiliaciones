var express = require('express')
var Peer = require('../../lib/models').Peer
var peerForm = require('./form')

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
