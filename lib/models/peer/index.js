var mongoose = require('mongoose')
var PeerSchema = require('./schema')

PeerSchema.methods.delete = function (cb) {
  this.deletedAt = new Date()
  this.save(cb)
}

module.exports = mongoose.model('Peer', PeerSchema)
