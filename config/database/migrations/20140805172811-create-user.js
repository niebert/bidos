module.exports = {
  up: function(migration, DataTypes, done) {
    migration
      .createTable('Users', {
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
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        enabled: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
        },
        updatedAt: {
          type: DataTypes.DATE,
        }
      })
      .complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration
      .dropTable('Users')
      .complete(done);
  }
};
