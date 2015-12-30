/**
* Configuration
*
* - Default config options will be loaded from `/config/defaults.json`. Also it
*   will be used as reference for the Type the values should have.
*
* - Environment specific overrides are optional, using `/config/{NODE_ENV}.json`.
*
* - Environment Variables also can be used to override options (recommended for
*   production).
*   + Var names should be CONSTANT_CASE.
*     + e.g.: `mongoUrl` => `MONGO_URL`
*     + Scoped variables e.g.: `notifications.url` => `NOTIFICATIONS_URL`
*   + `Arrays`s should be strings separated by commas.
*     + e.g.: `"staff": ["mail@eg.com", "a@c.m"]` => `STAFF="mail@eg.com,a@c.m"`
*   + `Boolean`s should be `true` or `false` as strings.
*     + e.g.: `"rssEnabled": false` => `RSS_ENABLED="false"`
*   + Var Types are casted using `./cast-string.js`
**/

var path = require('path')
var fs = require('fs')
var typeOf = require('component-type')
var changeCase = require('change-case')
var objForEach = require('./obj-for-each')
var cast = require('./cast-string')

var env = process.env
var environment = env.NODE_ENV || 'development'

var configFolderPath = path.join(__dirname, '..')
var defaultsPath = path.join(configFolderPath, 'defaults.json')
var envPath = path.join(configFolderPath, environment + '.json')

var defaultConfig = require(defaultsPath)
var environmentConfig = fs.existsSync(envPath) ? require(envPath) : {}
var config = {}

objForEach(defaultConfig, parse)

function parse (val, key, scope) {
  var s = scope ? scope.slice(0) : []
  var c = get(config, s)
  var newVal

  if (typeOf(val) === 'object') {
    c[key] = {}
    objForEach(val, parse, s.concat(key))
    return
  }

  var envKey = s.concat(key).map(changeCase.constantCase).join('_')
  if (env.hasOwnProperty(envKey)) {
    try {
      newVal = cast(typeOf(val), env[envKey])
    } catch (e) {
      throw new Error('There was an error when parsing ENV "' + envKey + '": ' + e)
    }
    c[key] = newVal
    return
  }

  var local = get(environmentConfig, s)
  if (local && local.hasOwnProperty(key)) {
    newVal = local[key]
    if (typeOf(val) !== typeOf(newVal)) {
      throw new Error('Invalid value for key "' + key + '" on "' + environment + '.json": ' + '". Should be "' + typeOf(val) + '".')
    }
    c[key] = newVal
    return
  }

  c[key] = val
}

function get (obj, scope) {
  var c = obj
  if (scope) scope.forEach(function (k) { c = c ? c[k] : null })
  return c
}

config.env = environment

module.exports = config
