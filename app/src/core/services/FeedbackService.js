'use strict';
/* global angular */

angular.module('bidos')
.service('FeedbackService', FeedbackService);

function FeedbackService($http, $q, CONFIG) {

  return {
    send: send
  };

  function send (feedback) {
    let url = [CONFIG.api, 'feedback'].join('/');
    return $q(function(resolve, reject) {
      $http.post(url, feedback)
        .success(function(response) {
          resolve(response);
        })
        .error(function(err) {
          reject(err);
        });
    });
  }

}
