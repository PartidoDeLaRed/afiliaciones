var express = require('express')
var bodyParser = require('body-parser')
var Peer = require('../../../lib/models').Peer
var peerForm = require('./form')

var app = express.Router()

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

app.param('id', function (req, res, next, id) {
  Peer.findOne({'_id': id, deletedAt: null}).exec(function (err, peer) {
    if (err) return res.status(500).send()
    if (!peer) return res.status(400).send()
    req.peer = peer
    next()
  })
})

app.get('/admin/peers/:id', function (req, res) {
  res.json(req.peer)
})

app.get('/api/admin/peers', function (req, res) {
  Peer.find({deletedAt: null}).exec(function (err, peers) {
    if (err) return res.status(500).send()
    res.json(peers)
  })
})

app.post('/admin/peers', peerForm, function (req, res) {
  Peer.create(req.peer, function (err, peer) {
    if (err) return res.status(500).send(err)
    res.status(200).send()
  })
})

app.put('/admin/peers/:id', peerForm, function (req, res) {
  req.peer.save(function (err) {
    if (err) return res.status(500).send(err)
    res.status(200).send()
  })
})

app.delete('/admin/peers/:id', function (req, res) {
  req.peer.delete(function (err) {
    if (err) return res.status(500).send(err)
    res.status(200).send()
  })
})

module.exports = app
