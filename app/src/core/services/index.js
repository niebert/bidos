(function() {
  'use strict';

  /* SERVICES */
  // http://stackoverflow.com/a/15666048/service-vs-provider-vs-factory
  // http://stackoverflow.com/a/17944367/220472

  require('./CacheService');
  require('./CRUDService');
  require('./HelpService');
  require('./ObservationService');
  require('./OutboxService');
  require('./ResourceService'); // ssot for any controller/directive

}());
