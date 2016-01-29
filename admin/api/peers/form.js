var Peer = require('../../../lib/models').Peer

module.exports = function (req, res, next) {
  var data = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    matricula: {
      numero: req.body.matricula_numero,
      tipo: req.body.matricula_tipo
    },
    sexo: req.body.sexo,
    estadoCivil: req.body.estadoCivil,
    lugarDeNacimiento: req.body.lugarDeNacimiento,
    fechaDeNacimiento: req.body.fechaDeNacimiento,
    telefono: req.body.telefono,
    profesion: req.body.profesion,
    tieneFirmas: req.body.tieneFirmas === 'check',
    noAfiliadoOtroPartido: req.body.noAfiliadoOtroPartido === 'check',
    mismoDomicilioDocumento: req.body.mismoDomicilioDocumento === 'check',
    domicilio: {
      calle: req.body.domicilio_calle,
      numero: req.body.domicilio_numero,
      piso: req.body.domicilio_piso,
      depto: req.body.domicilio_depto,
      codPostal: req.body.domicilio_codPostal,
      localidad: req.body.domicilio_localidad,
      provincia: req.body.domicilio_provincia
    }
  }
  
  if (req.body.mismoDomicilioDocumento !== 'check') {
    data.domicilioReal = {
      calle: req.body.domicilioReal_calle,
      numero: req.body.domicilioReal_numero,
      piso: req.body.domicilioReal_piso,
      depto: req.body.domicilioReal_depto,
      codPostal: req.body.domicilioReal_codPostal,
      localidad: req.body.domicilioReal_localidad,
      provincia: req.body.domicilioReal_provincia
    }
  }

  if (!req.peer) {
    req.peer = new Peer(data)
  } else {
    req.peer.set(data)
  }

  next()
}
