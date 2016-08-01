var nodemailer = require('nodemailer')
var sgTransport = require('nodemailer-sendgrid-transport')
var config = require('../../config')

var transport

if (config.mailer.transport === 'sendgrid') {
  transport = sgTransport({
    auth: {
      api_key: config.mailer.key
    }
  })
} else if (config.mailer.transport) {
  throw new Error('Invalid config.mailer.transport configuration option.')
}

module.exports = nodemailer.createTransport(transport)
