(function() {
  'use strict';
    /* global _, angular, document */

  // http://www.mattgreer.org/articles/traceur-gulp-browserify-es6/

  // pull it in and be done with it. more flexibility, cleanest and most simple
  // solution but a few k more overhead.
  require('traceur/bin/traceur-runtime');
  // require('traceur');

  require('jquery');
  require('hammerjs');

  require('lodash');
  _.mixin(require('lodash-deep'));

  // built on angular 1.3
  require('angular');

  // must be before angular-material
  require('angular-animate');
  require('angular-aria');

  // charts
  require('chart.js');
  require('angular-chart.js');

  require('angular-messages');

  // offline storage
  require('ng-storage');

  // auth
  // require('angular-jwt');

  // this is the cordova.js that's being copied during the apk build anyways.
  require('cordova-lib');
  require('ng-cordova');

  var cordovaInit = {
    initialize: function() {
      this.bindEvents();
    },

    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'cordovaInit.receivedEvent(...);'
    onDeviceReady: function() {
      angular.bootstrap(document, ['bidos']);
      cordovaInit.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
      var parentElement = document.getElementById(id);
      var listeningElement = parentElement.querySelector('.listening');
      var receivedElement = parentElement.querySelector('.received');

      listeningElement.setAttribute('style', 'display:none;');
      receivedElement.setAttribute('style', 'display:block;');

      console.log('Received Event: ' + id);
    }
  };

  cordovaInit.initialize();

  // NOTE angular-material and traceur are from bower as angular-material has no
  // proper up-to-date npm package. and traceur should not be bundled iirc

  // require('./app.js');

}());
