var mongoose = require('mongoose')
var validators = require('mongoose-validators')
var moment = require('moment')

module.exports = mongoose.Schema({
  nombre: {
    type: String,
    trim: true,
    maxlength: 512
  },
  apellido: {
    type: String,
    trim: true,
    maxlength: 512
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: validators.isEmail({skipNull: true})
  },
  telefono: {
    type: String,
    lowercase: true,
    trim: true
  },
  matricula: {
    numero: {
      type: Number,
      min: 1,
      max: 999999999
    },
    tipo: {
      type: String,
      enum: ['LE', 'LC', 'DNI'],
      default: 'DNI'
    }
  },
  sexo: {
    type: String,
    enum: ['F', 'M']
  },
  profesion: {
    type: String,
    trim: true,
    maxlength: 512
  },
  estadoCivil: {
    type: String,
    enum: ['soltero', 'casado', 'divorciado', 'viudo']
  },
  fechaDeNacimiento: {
    type: String,
    validate: [
      {
        validator: function (string) {
          return moment(string, 'YYYY-MM-DD').isValid()
        },
        msg: 'La fecha de nacimiento debe tener el formato AAAA-MM-DD.'
      },
      {
        validator: function (string) {
          var minor = moment().subtract(16, 'years')
          return moment(string, 'YYYY-MM-DD').isBefore(minor)
        },
        msg: 'El afiliado debe tener al menos 16 años.'
      }
    ]
  },
  // Ni idea qué es lugar de nacimiento, Pais? Ciudad? En mi DNI dice "Ciudad de Buenos Aires"...
  lugarDeNacimiento: {
    type: String,
    trim: true,
    maxlength: 2048
  },
  // El que aparece en el DNI
  domicilio: {
    calle: {
      type: String,
      trim: true,
      maxlength: 2048
    },
    numero: {
      type: String,
      trim: true,
      maxlength: 128
    },
    piso: {
      type: String,
      trim: true,
      maxlength: 128
    },
    depto: {
      type: String,
      trim: true,
      maxlength: 128
    },
    codPostal: {
      type: Number,
      max: 100000
    },
    localidad: {
      type: String,
      trim: true,
      maxlength: 256
    },
    provincia: {
      type: String,
      trim: true,
      maxlength: 256
    }
  },
  // En donde efectivamente se puede encontrar al afiliado
  domicilioReal: {
    calle: {
      type: String,
      trim: true,
      maxlength: 2048
    },
    numero: {
      type: String,
      trim: true,
      maxlength: 128
    },
    piso: {
      type: String,
      trim: true,
      maxlength: 128
    },
    depto: {
      type: String,
      trim: true,
      maxlength: 128
    },
    codPostal: {
      type: Number,
      max: 100000
    },
    localidad: {
      type: String,
      trim: true,
      maxlength: 256
    },
    provincia: {
      type: String,
      trim: true,
      maxlength: 256
    }
  }
})
