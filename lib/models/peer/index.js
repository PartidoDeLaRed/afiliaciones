var mongoose = require('mongoose')
var PeerSchema = require('./schema')

module.exports = mongoose.model('Peer', PeerSchema)
