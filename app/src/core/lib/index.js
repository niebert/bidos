(function() {
  'use strict';

  /* LOOSELY CHUNKED MVVC COMPONENTS WHERE CONTROLLERS COME WITH A DIRECTIVE */

  // resource service (ssot, very much core)
  require('./bx-resource-service');

  // tables for resource management (/w edit/new dialog)
  require('./bx-table');

  // observation service and directives
  require('./bx-observation-service');
  require('./bx-observation-inbox'); // hook before new are available
  require('./bx-capture'); // make new obs

  // single page infochart w/ charts. kids and items can have these
  require('./bx-portfolio');

  // big grid-things to select tasks and view stuff, like menus
  require('./bx-dashboard'); // main screen menu
  require('./bx-user-profile'); // "personal profile", kind of a menu with stuff
  require('./bx-user-preferences'); // "personal configuration", same same

  // other things
  require('./md-sidenav-controller'); // angular material design sidenav
  require('./bx-dialog');

}());