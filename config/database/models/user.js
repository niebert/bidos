(function() {
  'use strict';

  var mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      // bcrypt = require('bcrypt'),
      SALT_WORK_FACTOR = 10;

  var Promise = require("bluebird"),
      bcrypt = Promise.promisifyAll(require('bcrypt'));

  var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
  });

  UserSchema.pre('save', function(next) {
    var user = this;

      // only hash the password if it has been modified (or is new)
      if (!user.isModified('password')) return next();

      bcrypt.genSaltAsync(SALT_WORK_FACTOR).then(function(salt) {
        return bcrypt.hashAsync(user.password, salt);
      }).then(function(hash) {
        user.password = hash;
      });

    });

  UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    return bcrypt.compareAsync(candidatePassword, this.password);
  };

  module.exports = mongoose.model('User', UserSchema);
}());