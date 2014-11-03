(function() {
  'use strict';

  var crypt = require('bcrypt');

  module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
      jwtId:        DataTypes.STRING,
      email:        DataTypes.STRING,
      username:     DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        set: function(v) {
          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(v, salt);

          this.setDataValue('password', hash);
        }
      },
      lastName:     DataTypes.STRING,
      firstName:    DataTypes.STRING,
      organization: DataTypes.STRING,
      enabled:      DataTypes.STRING,
      phone:        DataTypes.STRING,
    }, {
      paranoid: true,
      instanceMethods: {
        comparePassword: function(candidatePassword, cb) {
          bcrypt.compare(candidatePassword, this.getDataValue('password'), function(err, isMatch) {
            if(err) return cb(err);
            cb(null, isMatch);
          });
        },
        // setPassword: function(v) {
        //   var salt = bcrypt.genSaltSync(10);
        //   var hash = bcrypt.hashSync(v, salt);

        //   this.setDataValue('password', hash);
        // },
        setToken: function() {
          // bla bla bla
          // bla bla bla
        },
        getFullname: function() {
          return [this.firstName, this.lastName].join(' ');
        }
      },
      classMethods: {
        associate: function(models) {
          // User.belongsTo(models.Role);
          // User.hasMany(models.Task);
        }
      }
    });

    return User;
  };

}());
