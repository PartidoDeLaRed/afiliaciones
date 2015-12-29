var path = require('path')
var express = require('express')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser')
var config = require('../config')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(cookieSession({keys: [config.secret]}))

app.use(express.static(path.join(__dirname, 'public')))

app.use(require('../auth'))

module.exports = app
