(function() {
  'use strict';

  module.exports = function(sequelize, DataTypes) {
    var Child = sequelize.define('Child', {
      firstName: DataTypes.STRING,
      lastName:  DataTypes.STRING
    }, {
      tableName: 'children',
      classMethods: {
        associate: function(models) {
          Child.belongsTo(models.Group);
        }
      }
    });

    return Child;
  };

}());
