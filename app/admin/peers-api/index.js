var express = require('express')
var bodyParser = require('body-parser')
var Peer = require('../../shared/models').Peer
var peerForm = require('./form')
var pictures = require('./pictures')

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

app.get('/peers/:id', function (req, res) {
  res.json(req.peer)
})

app.get('/peers', function (req, res) {
  Peer.find({deletedAt: null}).exec(function (err, peers) {
    if (err) return res.status(500).send(err)
    res.json(peers)
  })
})

app.post('/peers', peerForm, function (req, res) {
  Peer.create(req.peer, function (err, peer) {
    if (err) return res.status(500).send(err)
    res.status(200).json(peer)
  })
})

app.put('/peers/:id', peerForm, function (req, res) {
  req.peer.save(function (err) {
    if (err) return res.status(500).send(err)
    res.status(200).json(req.peer)
  })
})

app.delete('/peers/:id', function (req, res) {
  req.peer.delete(function (err) {
    if (err) return res.status(500).send(err)
    res.status(200).send()
  })
})

app.get('/peers/:id/pictures', function (req, res) {
  pictures.getUrls(req.peer, function (err, data) {
    if (err) return res.status(500).send(err)
    res.json(data)
  })
})

app.put('/peers/:id/pictures', function (req, res) {
  req.peer.imagenesDocumento = req.body;
  req.peer.save(function (err) {
    if (err) return res.status(500).send(err)
    res.status(200).json(req.peer)
  })
})

app.get('/peers/:id/pictures/upload-url', function (req, res) {
  pictures.getUploadUrl(req.query.filename, req.peer, function (err, data) {
    if (err) return res.status(500).send(err)
    res.json(data)
  })
})

module.exports = app
