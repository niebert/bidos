(function() {
  'use strict';

  module.exports = function(shipit) {
    shipit.initConfig({
      staging: {
        servers: 'liveandgov.uni-koblenz.de'
      }
    });

    shipit.task('pwd', function() {
      return shipit.remote('pwd');
    });
  };

}());
