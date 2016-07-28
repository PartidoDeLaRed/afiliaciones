var nodemailer = require('nodemailer')
var sgTransport = require('nodemailer-sendgrid-transport')
var config = require('../../config')

module.exports = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: config.mailer.key
  }
}))
