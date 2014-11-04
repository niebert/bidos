(function() {
  'use strict';

  // https://github.com/sequelize/sequelize/wiki/API-Reference-Sequelize

  var db = require('./models');
  var main = function() {
    db.sequelize.sync({ force: true }).complete(function(err) {
       if (!!err) {
         console.log('An error occurred while creating the table:', err);
       } else {
        console.log('Database schemes synchronized.');

        db.User.create({
          email: 'asdf@uni-koblenz.de',
          firstName: 'René',
          organization: 'Universität Koblenz-Landau, Campus Koblenz',
          lastName: 'Wilhelm',
          phone: '0160 8040042',
          username: 'asdf'
        })
        .success(function(user) {
          // debugger
        })
        .error(function(error) {
        });

       }
    });

  };


  // TODO return a promise here to be safe?
  module.exports = exports = main;

}());
