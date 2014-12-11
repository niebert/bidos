/* jshint: case: false */
/* global angular */

(function() {
  'use strict';

  var _ = require('lodash');

  require('./services');

  angular.module('bidos.resource.directives', [
  ]).directive('raiseOnHover', raiseOnHover);

  function raiseOnHover() {
    return {
      link : function(scope, element, attrs) {
        element.parent().bind('mouseenter', function() {
          element.show();
        });
        element.parent().bind('mouseleave', function() {
          element.hide();
        });
      }
    };
  }

}());
