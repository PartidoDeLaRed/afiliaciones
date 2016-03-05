var path = require('path')

module.exports = require('democracyos-config')({
  path: path.join(__dirname, '..', 'config')
})
