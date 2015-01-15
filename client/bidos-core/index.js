(function() {
  'use strict';

  require('lodash');

  // manage resources
  require('./services/ResourceService');
  require('./services/ResourceHelper');
  require('./bidos-resources');

  // do observation
  require('./services/CaptureService');
  require('./bidos-capture');
  require('./bidos-observe');
  require('./bidos-select');
  require('./directives/bidos-select-kid-button');
  require('./bidos-finish-observation/bidos-finish-observation');

  require('./bidos-profile');
  require('./bidos-status');

  require('./controllers/md-sidenav-controller.js'); // TODO bundle into directive

  require('./bidos-dashboard');
  require('./bidos-portfolio');

  require('./filters');
  require('./routes');

}());
