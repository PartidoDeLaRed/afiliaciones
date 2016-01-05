var express = require('express')
var passport = require('passport')

var app = express.Router()

app.get('/admin/login', function (req, res) {
  if (req.user) return res.redirect('/admin')
  res.render('login')
})

app.post('/admin/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      console.error(err)
      return res.redirect('/admin/login')
    }

    if (!user) {
      return res.redirect('/admin/login')
    }

    req.logIn(user, function (err) {
      if (err) {
        console.error(err)
        return res.redirect('/admin/login')
      }
      return res.redirect('/admin')
    })
  })(req, res, next)
})

app.get('/admin/logout', function (req, res) {
  req.logout()
  res.redirect('/admin')
})

module.exports = app
