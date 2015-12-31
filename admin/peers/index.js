var express = require('express')
var passport = require('passport')

var app = express.Router()

app.get('/admin/login', function (req, res) {
  res.render('login')
})

// app.post('/admin/login', passport.authenticate('local', {
//   successRedirect: '/admin',
//   failureRedirect: '/admin/login',
//   failureFlash: true
// }))

app.post('/admin/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      console.error(err)
      return res.redirect('/admin/login')
    }

    if (!user) {
      //console.log('User not found', req.body)
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

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/admin')
})

module.exports = app
