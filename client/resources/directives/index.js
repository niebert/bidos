/* jshint: case: false */
/* global angular */

(function() {
  'use strict';

  require('./item-directive');
  require('./kid-directive');
  require('./debug-directive');

  require('./bidos-observe/bidos-observe');

  angular.module('bidos.resource.directives', [
    'bidos.observe',
    'bidos.item-directive',
    'bidos.kid-directive',
    'bidos.debug-directive'
  ])
  .directive('raiseOnHover', raiseOnHover)
  .directive('bidosSelectGroup', bidosSelectGroup)
  .directive('myTooltip', myTooltip);

  function myTooltip($log) {
    // allowed event listeners
    var allowedListeners = ['click'];
    return {
      restrict: 'A',
      template: '<div class="tooltip-title">{{tooltipTitle}}</div>' +
                '<div class="tooltip-content">' +
                '{{tooltipContent}}</div>',
      scope: {
        tooltipTitle: '@tooltipTitle',
        tooltipContent: '@tooltipContent'
      },
      link: function (scope, elm, attrs) {
        if (allowedListeners.indexOf(attrs.myTooltip) !== -1) {
          elm.bind(attrs.myTooltip, function () {
            $log.info('clicked');
          });
        }

      }
    };
  }

  function bidosSelectGroup() {
    return {
      restrict: 'E',
      template: '<select name="select"> <option ng-repeat="g in groups" value="value1">{{g.name}}</option> </select>',
      scope: { groups: '@groups' },
      link : function(s,e,a) {
        console.log('SCOPE____', s);
        console.log('ELEMENT__', e);
        console.log('ATTRIBUTE', a);
      }
    };
  }

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
