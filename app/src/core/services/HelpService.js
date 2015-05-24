/* globals angular*/
angular.module('bidos')
  .service('Help', HelpService);

function HelpService($mdToast) {

  var COLORS = {
    success: '#77d598',
    fail: '#ca6164'
  };

  return {
    toast: toast,
    log: log,
    warn: warn
  };

  function toast(content) {
    $mdToast.show($mdToast.simple()
      .content(content)
      .position('bottom right')
      .hideDelay(3000));
  }

  function log(message, response) {
    console.log('%c' + message, COLORS.warn + '; font-size: 1.1em;', (response || ''));
  }

  function warn(message, response) {
    console.warn('%c' + message, COLORS.warn + '; font-size: 1.1em;', (response || ''));
  }
}
