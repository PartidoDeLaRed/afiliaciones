var config = require('./config')
var app = require('./lib')

app.start(config.port, function () {
  console.log(' · Afiliaciones · ')
  console.log(' · ' + config.port + ' · ')
})
