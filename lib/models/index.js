var mongoose = require('mongoose')
var config = require('../config')

var log = require('debug')('afiliaciones:models')

mongoose.connect(config.mongoUrl)

mongoose.connection.on('error', function (err) { log(err) })

exports.User = require('./user')
