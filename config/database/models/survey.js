(function() {
  'use strict';

  module.exports = function(sequelize, DataTypes) {
    var Survey = sequelize.define('Survey', {
               firstName:  DataTypes.STRING,
               lastName:   DataTypes.STRING,
               email:      DataTypes.STRING,
               password:   DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
          Survey.hasMany(models.Item);
        }
      }
    });

    return Survey;
  };

}());
