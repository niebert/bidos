(function() {
  'use strict';

  require('lodash');

  require('./bidos-dashboard');
  require('./bidos-items');
  require('./bidos-groups'); // TODO bundle with kids
  require('./bidos-kids');
  require('./bidos-observations');
  require('./bidos-subdomains'); // TODO bundle with items
  require('./bidos-users');
  require('./bidos-capture');
  require('./bidos-observe');
  require('./bidos-profile');
  require('./bidos-status');

  require('./bidos-select-kid');
  require('./bidos-select-item');
  require('./bidos-select-domain');
  require('./bidos-select-subdomain');

  require('./services/CaptureService');

  require('./services/ResourceService');
  require('./services/ResourceHelper');

  // require('./services/ItemFactory');
  // require('./services/ExampleFactory');
  // require('./services/ObservationFactory');

  // require('./services/KidFactory');
  // require('./services/GroupFactory');

  require('./controllers/md-sidenav-controller.js'); // TODO bundle into directive

  require('./filters');
  require('./routes');

  require ('./directives/bidos-select-kid-button');
  require ('./bidos-select-behaviour/bidos-select-behaviour');
  require ('./bidos-select-help/bidos-select-help');
  require ('./bidos-finish-observation/bidos-finish-observation');

}());
