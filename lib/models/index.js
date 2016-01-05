var mongoose = require('mongoose')
var config = require('../../config')

var STATES = mongoose.Connection.STATES
var conn = mongoose.connection

mongoose.connect(config.mongoUrl)

process.on('SIGINT', function () {
  conn.close(function () {
    process.exit(1)
  })
})

exports.ready = function () {
  if (STATES.connecting === conn.readyState) {
    return new Promise(function (_accept, _reject) {
      conn.once('connected', accept)
      conn.once('error', reject)
      conn.once('disconnected', reject)

      function off () {
        conn.removeListener('connected', accept)
        conn.removeListener('error', reject)
        conn.removeListener('disconnected', reject)
      }

      function accept () {
        off()
        _accept()
      }

      function reject () {
        off()
        _reject()
      }
    })
  }

  if (STATES.connected === conn.readyState) {
    return Promise.resolve()
  }

  return Promise.reject()
}

exports.User = require('./user')
exports.Peer = require('./peer')
