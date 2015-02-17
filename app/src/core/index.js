(function() {
  'use strict';

  require('lodash');

  /* LOOSELY CHUNKED MVVC COMPONENTS WHERE CONTROLLERS COME WITH A DIRECTIVE */

  // stuff
  require('./routes');
  require('./filters');

  // resource service (ssot)
  require('./lib/bx-resource-service');

  // tables for resource management (/w edit/new dialog) (core core stuff)
  require('./lib/bx-resource-table');

  // observation service and directives
  require('./lib/bx-observation-service');
  require('./lib/bx-observation-inbox'); // hook before new are available
  require('./lib/bx-observation-capture'); // make new obs

  // single page infochart w/ charts. kids and items can have these
  require('./lib/bx-portfolio');

  // big grid-things to select tasks and view stuff, like menus
  require('./lib/bx-dashboard'); // main screen menu
  require('./lib/bx-user-profile'); // "personal profile", kind of a menu with stuff
  require('./lib/bx-user-preferences'); // "personal configuration", same same

  // other things
  require('./lib/md-sidenav-controller'); // angular material design sidenav

}());
