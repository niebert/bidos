(function() {
  'use strict';

  require('lodash');

  // services
  require('./services/ResourceService');
  require('./services/ResourceHelper');
  require('./services/CaptureService');

  // misc controllers
  require('./controllers/md-sidenav-controller');

  // resource management
  require('./bidos-resources');

  // do observation
  require('./bidos-capture');

  // user profiles
  require('./bidos-profile');

  // system status
  require('./bidos-status');

  // main screen
  require('./bidos-dashboard');

  // charts and stuff
  require('./bidos-statistics');

  // stuff
  require('./filters');
  require('./routes');

}());
