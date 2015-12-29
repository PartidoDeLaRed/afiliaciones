var config = require('./lib/config')
var app = require('./lib/boot')

app.listen(config.port, function () {
  console.log(' · Afiliaciones · ')
  console.log(` · ${config.port} · `)
})
