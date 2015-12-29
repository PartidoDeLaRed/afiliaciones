var mongoose = require('mongoose')
var config = require('../config')

mongoose.connect(config.mongoUrl)

mongoose.connection.on('error', function (err) { console.error(err) })

exports.User = require('./user')
exports.Peer = require('./peer')
