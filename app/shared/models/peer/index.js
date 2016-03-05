var mongoose = require('mongoose')
var PeerSchema = require('./schema')

PeerSchema.set('toJSON', {getters: true, versionKey: false})

PeerSchema.options.toJSON.transform = function (doc, ret) {
  delete ret._id
}

PeerSchema.methods.delete = function (cb) {
  this.deletedAt = new Date()
  this.save(cb)
}

PeerSchema.virtual('id').get(function () { return this._id })

module.exports = mongoose.model('Peer', PeerSchema)
