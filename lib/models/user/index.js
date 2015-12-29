var mongoose = require('mongoose')
var validators = require('mongoose-validators')
var passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    lowercase: true,
    validate: validators.isEmail()
  }
})

UserSchema.index({email: 1})

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  userExistsError: 'There is already a user using %s',
  interval: 1000,
  saltField: 'loginSalt',
  hashField: 'loginHash',
  attemptsField: 'loginAttemps',
  lastLoginField: 'loginLast'
})

module.exports = mongoose.model('User', UserSchema)
