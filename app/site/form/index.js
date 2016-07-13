var express = require('express')
var nodemailer = require('nodemailer');
var app = express.Router()

app.get('/afiliate', function(req, res) {
    res.render('form')
})

app.post('/afiliate', function(req, res) {

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport();

    var data = req.body;

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"Afiliaciones - PdR" <afiliaciones@partidodelared.org>', // sender address
        to: data.email,
        subject: '¡Bienvenido al Partido de la Red!', // Subject line
        html: '<b>Hello world 🐴</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
        	res.status(500).send('error');
        	console.log('not sent');
        }
        else
        {
        	res.status(200).send('ok');
        	console.log('sent');
        }
    });


})
module.exports = app
