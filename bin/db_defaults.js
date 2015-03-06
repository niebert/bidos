(function() {
  'use strict';
  // jshint esnext:true

  let _ = require('lodash');
  let Promise = require('bluebird');
  let request = require('superagent');
  let domains = require('./db_defaults.json');

  const API = 'localhost:3002/v1';

  function postRequest(payload) {
    return new Promise(function(resolve, reject) {
      request
        .post([API, payload.type].join('/'))
        .send(payload)
        .end(function(res) {
          if (res.ok) {
            resolve(res.body);
          } else {
            reject(res.body);
          }
        });
    });
  }

  _.each(domains, function(domain) {
    let payload = {
      name: domain.name,
      type: domain.type
    };

    postRequest(payload).then(function(response) {
      _.each(domain.subdomains, function(subdomain) {
        let payload = {
          name: subdomain.name,
          type: subdomain.type
        };

        payload[response[0].type + '_id'] = response[0].id;

        postRequest(payload).then(function(response) {
          _.each(subdomain.items, function(item) {
            let payload = {
              name: item.name,
              type: item.type
            };

            payload[response[0].type + '_id'] = response[0].id;

            postRequest(payload).then(function(response) {
              _.each(item.behaviours, function(behaviour) {
                let payload = {
                  text: behaviour.text,
                  type: behaviour.type,
                  niveau: behaviour.niveau
                };

                payload[response[0].type + '_id'] = response[0].id;

                postRequest(payload).then(function(response) {
                  _.each(behaviour.examples, function(example) {
                    let payload = {
                      text: example.text,
                      type: example.type
                    };

                    payload[response[0].type + '_id'] = response[0].id;

                    postRequest(payload);

                  });
                });
              });
            });
          });
        });
      });
    });
  });

}());
