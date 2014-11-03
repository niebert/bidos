(function() {
  'use strict';

  module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
      firstName:    DataTypes.STRING,
      lastName:     DataTypes.STRING,
      username:     DataTypes.STRING,
      email:        DataTypes.STRING,
      password:     DataTypes.STRING,
      organization: DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
          // User.hasMany(models.Group);
          // User.hasOne(models.Role, {through: 'users_roles'});
          User.hasMany(models.Task);
        }
      }
    });

    return User;
  };

}());


"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task)
      }
    }
  });

  return User;
};
