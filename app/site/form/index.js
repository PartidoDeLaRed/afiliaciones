var express = require('express')
var config = require('../../config')
var mailer = require('../../shared/mailer')
var Peer = require('../../shared/models').Peer
var personForm = require('../person-form')

var app = express.Router()

app.get('/afiliate', function (req, res) {
  res.render('form')
})

app.post('/afiliate', personForm.parse, function validate (req, res, next) {
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

  //Guardamos en la base de datos a la persona
  Peer.create(req.peer, function(err, peer) {
    if (err) return res.status(500).send(err)
  });

  //Mandamos los mail al inscripto y al administrador
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
