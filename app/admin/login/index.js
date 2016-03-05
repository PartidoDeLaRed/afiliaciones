var express = require('express')
var passport = require('passport')

var app = express.Router()

app.get('/login', function (req, res) {
  if (req.user) return res.redirect(req.baseUrl)
  res.render('login')
})

app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      console.error(err)
      return res.redirect(req.baseUrl + '/login')
    }

    if (!user) {
      return res.redirect(req.baseUrl + '/login')
    }

    req.logIn(user, function (err) {
      if (err) {
        console.error(err)
        return res.redirect(req.baseUrl + '/login')
      }
      return res.redirect(req.baseUrl)
    })
  })(req, res, next)
})

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect(req.baseUrl)
})

app.all('/*', function (req, res, next) {
  if (req.user) return next()
  res.redirect(req.baseUrl + '/login')
})

module.exports = app
