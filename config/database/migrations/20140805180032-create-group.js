module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('Groups', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
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
    migration.dropTable('Groups');
    done();
  }
};
