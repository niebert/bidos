require('./app');
require('./auth');

require('./core/filters');
require('./core/routes');

require('./core/services/CacheService');
require('./core/services/CRUDService');
require('./core/services/HelpService');
require('./core/services/ObservationService');
require('./core/services/OutboxService');
require('./core/services/ResourceService'); // single source of truth for any controller/directive

require('./core/controllers/AppController');
require('./core/controllers/ToolbarController');
require('./core/controllers/ContentController');
require('./core/controllers/DialogController');

// require('./core/directives/app');
// require('./core/directives/table');

// // observation service and directives
// require('./core/directives/observation-inbox'); // hook before new are available
// require('./core/directives/capture'); // make new obs

// // single page infochart w/ charts. kids and items can have these
// require('./core/directives/portfolio');

// // big grid-things to select tasks and view stuff, like menus
// require('./core/directives/dashboard'); // main screen menu
// require('./core/directives/profile'); // "personal profile", kind of a menu with stuff
// require('./core/directives/preferences'); // "personal configuration", same same

