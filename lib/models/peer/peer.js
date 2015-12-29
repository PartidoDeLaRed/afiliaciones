var mongoose = require('mongoose')
var PeerSchema = require('./schema')

function Peer (attrs) {
  return new mongoose.Document(attrs, PeerSchema)
}

module.exports = Peer
