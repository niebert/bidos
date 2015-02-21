(function() {
  'use strict';

  /* SERVICES */
  // http://stackoverflow.com/a/15666048/service-vs-provider-vs-factory
  // http://stackoverflow.com/a/17944367/220472

  // resource service (ssot, very much core)
  require('./ObservationService');
  require('./IndexedDBService');
  require('./ResourceService');
  require('./HelpService');
  require('./CRUDService');

}());
