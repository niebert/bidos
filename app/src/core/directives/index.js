(function() {
  'use strict';

  /* LOOSELY CHUNKED MVVC COMPONENTS WHERE CONTROLLERS COME WITH A DIRECTIVE */

  // tables for resource management (/w edit/new dialog)
  require('./bx-table');

  // observation service and directives
  require('./bx-observation-inbox'); // hook before new are available
  require('./bx-capture'); // make new obs

  // single page infochart w/ charts. kids and items can have these
  require('./bx-portfolio');

  // big grid-things to select tasks and view stuff, like menus
  require('./bx-dashboard'); // main screen menu
  require('./bx-profile'); // "personal profile", kind of a menu with stuff
  require('./bx-preferences'); // "personal configuration", same same

  // other things
  require('./bx-dialog');

}());