var config = require('./config')
var app = require('./lib')

app.listen(config.port, function () {
  console.log(' · Afiliaciones · ')
  console.log(` · ${config.port} · `)
})
