var config = require('./lib/config')
var app = require('./lib/boot')

var log = require('debug')('afiliaciones')

app.listen(config.port, function () {
  log('· Afiliaciones - Partido de la Red ·')
  log(`· ${config.port} ·`)
})
