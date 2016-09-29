var express = require('express')
var Peer = require('../../shared/models').Peer

var app = express.Router()

app.get('/api/peers/count', function (req, res) {
  Peer.find().count().exec(function (err, count) {
    if (err) {
      return res.status(500).end()
    }

    res.json(200, count)
  })
})

module.exports = app
