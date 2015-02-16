(function() {
  'use strict';

  require('lodash');

  /* LOOSELY CHUNKED MVVC COMPONENTS WHERE CONTROLLERS COME WITH A DIRECTIVE */

  // services
  require('./lib/bx-resource-service');
  require('./lib/bx-observation-service');

  // tables for resource management (/w edit/new dialog) (core core stuff)
  require('./lib/bx-table');

  // observation stuff
  require('./lib/bx-capture'); // make new
  require('./lib/bx-observation-inbox'); // hook before new are available

  // big grid-things to select tasks and view stuff, like menus
  require('./lib/bx-dashboard'); // main screen menu
  require('./lib/bx-user-profile'); // "personal profile", kind of a menu with stuff
  require('./lib/bx-user-preferences'); // "personal configuration", same same

  // single page infochart w/ charts, kids and items can have these
  require('./lib/bx-portfolio');

  // other things
  require('./lib/md-sidenav-controller'); // angular material design sidenav

  // stuff
  require('./filters');
  require('./routes');

}());
