var express = require('express')
var nodemailer = require('nodemailer');
var sendgridTransport = require('nodemailer-sendgrid-transport');
var hbs = require('nodemailer-express-handlebars');
var app = express.Router()

app.get('/afiliate', function(req, res) {
    res.render('form')
})

app.post('/afiliate', function (req, res) {
  
  // create reusable transporter object using the default SMTP transport
  var optionsTransport = {
    auth: {
      api_key: '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'
    }
  };
  var optionsTemplate = {
    viewEngine: {
      extname: '.hbs',
      layoutsDir: 'app/site/emails/'
    },
    viewPath: 'app/site/emails/',
    extName: '.hbs'
  };
  var transporter = nodemailer.createTransport(sendgridTransport(optionsTransport));
  transporter.use('compile', hbs(optionsTemplate));
  
  var data = req.body;
  if(data['barrios'])
    data.barriosString = data['barrios'].join ? data['barrios'].join(', ') : data['barrios'];
  
  ///////MAIL PARA EL AFILIADO
  var mailAfiliadoOptions = {
    from: '"Afiliaciones - PDR" <afiliaciones@partidodelared.org>',
    to: data.email,
    subject: '¡Bienvenido al Partido de la Red!',
    template: 'mail-afiliado',
    context: {
      datos : data
    }
  };
  
  transporter.sendMail(mailAfiliadoOptions, function (error, info) {
    if (error) {
      res.status(500).send('error');
      console.log(error);
    }
    else {
      res.status(200).send('ok');
      console.log('sent to peer');
    }
  });
  ////////////////


  ///////MAIL PARA EL ADMINISTRADOR
  var mailAdminOptions = {
    from: '"Afiliaciones - PDR" <afiliaciones@partidodelared.org>',
    to: 'afiliaciones@partidodelared.org',
    subject: data.name + ' ' + data.lastname + ' - ' + (data.barriosString ? data.barriosString : '(Ningún barrio)'),
    template: 'mail-afiliado-admin',
    context: {
      datos : data
    }
  };
  
  transporter.sendMail(mailAdminOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
    else {
      console.log('sent to admin');
    }
  });
  ////////////////

})

module.exports = app
