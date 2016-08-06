var mongoose = require('mongoose')
var validators = require('mongoose-validators')
var moment = require('moment')

module.exports = mongoose.Schema({
  nombre: {
    type: String,
    trim: true,
    maxlength: 512,
    require: true
  },
  apellido: {
    type: String,
    trim: true,
    maxlength: 512,
    require: true
  },
  email: {
    type: String,
    validate: validators.isEmail({ skipNull: true, message: 'El email debe tener el formato ejemplo@dominio.com' }),
    trim: true,
    require: false,
    lowercase: true
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
      enum: ['-', 'LE', 'LC', 'DNI'],
      default: 'DNI'
    }
  },
  sexo: {
    type: String,
    enum: ['-', 'F', 'M']
  },
  profesion: {
    type: String,
    trim: true,
    maxlength: 512
  },
  nombreMadre: {
    type: String,
    trim: true,
    maxlength: 512
  },
  nombrePadre: {
    type: String,
    trim: true,
    maxlength: 512
  },
  estadoCivil: {
    type: String,
    enum: ['-', 'soltero', 'casado', 'divorciado', 'viudo']
  },
  fechaDeNacimiento: {
    type: String,
    validate: [
      {
        validator: function (string) {
          return moment(string, 'YYYY-MM-DD').isValid()
        },
        msg: 'La fecha de nacimiento es obligatoria. Debe tener el formato DD-MM-YYYY.'
      },
      {
        validator: function (string) {
          var minor = moment().subtract(16, 'years')
          var mayor = moment().subtract(100, 'years')
          return moment(string, 'YYYY-MM-DD').isBefore(minor) && moment(string, 'YYYY-MM-DD').isAfter(mayor)
        },
        msg: 'El afiliado debe tener entre 16 y 100 años. (Fecha de Nacimiento)'
      }
    ]
  },
  lugarDeNacimiento: {
    type: String,
    trim: true,
    maxlength: 2048
  },
  tieneFirmas: {
    type: Boolean
  },
  noAfiliadoOtroPartido: {
    type: Boolean
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
  mismoDomicilioDocumento: {
    type: Boolean,
    require: true
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
  },
  imagenesDocumento: {
    frente: String,
    dorso: String,
    cambioDomicilio: String
  },
  createdBy: { type: String },
  lastEditedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  enlace: { type: String }
})
