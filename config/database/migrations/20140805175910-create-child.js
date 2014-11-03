module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('Children', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    });
    done();
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('Children');
    done();
  }
};
