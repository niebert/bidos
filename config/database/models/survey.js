(function() {
  'use strict';

  module.exports = function(sequelize, DataTypes) {
    var Quest = sequelize.define('Quest', {
               firstName:  DataTypes.STRING,
               lastName:   DataTypes.STRING,
               email:      DataTypes.STRING,
               password:   DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
          Quest.hasMany(models.Item);
        }
      }
    });

    return Quest;
  };

}());
