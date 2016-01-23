var express = require('express')
var bodyParser = require('body-parser')
var Peer = require('../../lib/models').Peer

var app = express.Router()

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

app.param('id', function (req, res, next, id) {
  Peer.findOne({'_id': id}).exec(function (err, peer) {
    if (err) return res.status(400).send()
    req.peer = peer
    next()
  })
})

app.get('/api/admin/peers', function (req, res) {
  Peer.find({deletedAt: null}).exec(function (err, peers) {
    if (err) return res.status(500).send()
    res.json(peers)
  })
})

module.exports = app
