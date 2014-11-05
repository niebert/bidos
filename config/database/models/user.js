(function() {
  'use strict';

  var bcrypt = require('bcrypt');

  module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
      jwt_id: DataTypes.STRING,

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        set: function(v) {
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(v, salt, function(err, hash) {
              this.setDataValue('password', hash);
            }.bind(this));
          }.bind(this));
        }
      },

      lname: {
        type: DataTypes.STRING,
        allowNull: false
      },

      fname: {
        type: DataTypes.STRING,
        allowNull: false
      },

      organization: {
        type: DataTypes.STRING,
        allowNull: true
      },

      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }

    }, {
      paranoid: true,
      instanceMethods: {
        comparePassword: function(v, cb) {
          bcrypt.compare(v, this.getDataValue('password'), function(err, isMatch) {
            if(err) return cb(err);
            cb(null, isMatch);
          });
        },
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
