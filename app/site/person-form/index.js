var Peer = require('../../shared/models').Peer

module.exports = {
  parse: parse
}

function parse (req, res, next) {
  var data = {
    nombre: req.body.name,
    apellido: req.body.lastname,
    email: req.body.email,
    telefono: req.body.tel,
  }
  req.peer = new Peer(data)

  next()
}
