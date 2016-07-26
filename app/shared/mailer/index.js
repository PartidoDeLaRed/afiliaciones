var nodemailer = require('nodemailer')
var config = require('../../config')

module.exports = nodemailer.createTransport(config.mailer.transport, {
  auth: {
    api_key: config.mailer.key
  }
})
