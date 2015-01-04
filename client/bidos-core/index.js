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

  require('./services/ResourceService');
  require('./services/ResourceHelper');

  require('./services/ItemFactory');
  require('./services/BehaviourFactory');
  require('./services/ExampleFactory');
  require('./services/ObservationFactory');

  // require('./services/KidFactory');
  // require('./services/GroupFactory');

  require('./controllers/md-sidenav-controller.js'); // TODO bundle into directive

  require('./filters');
  require('./routes');

}());
