require('./auth');

require('./app');

require('./core/controllers/ActionbarController');
require('./core/controllers/AppController');
require('./core/controllers/ContentController');
require('./core/controllers/dialog-controllers/info-dialog-controller');
require('./core/controllers/dialog-controllers/settings-dialog-controller');
require('./core/controllers/DialogController');
require('./core/controllers/ObservationController');
require('./core/controllers/ToolbarController');
require('./core/directives/user-preferences-dialog/settings-dialog-controller');
require('./core/directives/user-preferences-dialog/settings-dialog-directive');
require('./core/filters');
require('./core/routes');
require('./core/services/CacheService');
require('./core/services/CRUDService');
require('./core/services/HelpService');
require('./core/services/ObservationService');
require('./core/services/OutboxService');
require('./core/services/ResourceService');
require('./lib/approveUser');
require('./strings');
