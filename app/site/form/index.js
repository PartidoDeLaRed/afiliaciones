var express = require('express')
var config = require('../../config')
var mailer = require('../../shared/mailer')

var app = express.Router()

app.get('/afiliate', function (req, res) {
  res.render('form')
})

app.post('/afiliate', function validate (req, res, next) {
  // req.check({
  //   email: {
  //     notEmpty: true,
  //     isEmail: true
  //   },
  //   name: {
  //     notEmpty: true,
  //     isLength: {options: [{max: 124}]}
  //   },
  //   lastname: {
  //     optional: true,
  //     isLength: {options: [{max: 124}]}
  //   },
  //   barrios: {
  //     isArray: true
  //   }
  // })
  //
  // req.sanitize('name').trim()
  // req.sanitize('name').escape()
  // req.sanitize('lastname').trim()
  // req.sanitize('lastname').escape()

  if (req.validationErrors()) {
    res.status(400).send()
  } else {
    next()
  }
}, function (req, res) {
  var data = req.body

  if (data.barrios) {
    data.barrios = data.barrios.join ? data.barrios.join(', ') : data.barrios
  }

  res.render('emails/mail-afiliado', data, function (err, html) {
    if (err) {
      console.error(err)
      return
    }

    mailer.sendMail({
      from: config.mailer.sender.name,
      to: data.email,
      subject: '¡Bienvenido al Partido de la Red!',
      html: html
    }, function (err, info) {
      if (err) {
        console.error(err)
      } else {
        console.log('Mail "emails/mail-afiliado" sent with data: ', data)
      }
    })
  })

  res.render('emails/mail-afiliado-admin', data, function (err, html) {
    if (err) {
      console.error(err)
      return
    }

    mailer.sendMail({
      from: config.mailer.sender.name,
      to: config.mailer.sender.email,
      subject: '[${data.barriosString || "Ningún barrio"}] ${data.name} ${data.lastname}',
      html: html
    }, function (err) {
      if (err) {
        console.error(err)
      } else {
        console.log('Mail "emails/mail-afiliado-admin" sent with data: ', data)
      }
    })
  })

  res.status(200).send('ok')
})

module.exports = app
