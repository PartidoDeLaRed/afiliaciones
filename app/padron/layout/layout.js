var $ = require('jquery')
var toObject = require('form-to-object')
var page = require('page')
var notify = require('notification')
var content = require('./content')

require('./lib/extend-jquery')
require('./lib/extend-notification')

require('../padron')

page()