(function() {
  'use strict';
  // jshint esnext:true

  let _ = require('lodash');
  let Promise = require('bluebird');
  let request = require('superagent');
  let domains = require('./seeds.json');

  let config = require('../../app/api/config');

  // disable auth before running this

  function postRequest(payload) {
    let url = [config.api, payload.type].join('/');
    return new Promise(function(resolve, reject) {
      request
        .post(url)
        .send(payload)
        .end(function(err, res) {
          if (err) {
            reject(new Error(err));
          }
          if (res.ok) {
            resolve(res.body);
          } else {
            console.log(res.body);
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
    console.log(`[${response[0].type} #${response[0].id}] ${response[0].name}`);
      _.each(domain.subdomains, function(subdomain) {
        let payload = {
          name: subdomain.name,
          type: subdomain.type
        };

        payload[response[0].type + '_id'] = response[0].id;

        postRequest(payload).then(function(response) {
          console.log(`[${response[0].type} #${response[0].id}] ${response[0].name}`);
          _.each(subdomain.items, function(item) {
            let payload = {
              name: item.name,
              type: item.type
            };

            payload[response[0].type + '_id'] = response[0].id;

            postRequest(payload).then(function(response) {
              console.log(`[${response[0].type} #${response[0].id}] ${response[0].name}`);
              _.each(item.behaviours, function(behaviour) {
                let payload = {
                  text: behaviour.text,
                  type: behaviour.type,
                  niveau: behaviour.niveau
                };

                payload[response[0].type + '_id'] = response[0].id;

                postRequest(payload).then(function(response) {
                  console.log(`[${response[0].type} #${response[0].id}] ${response[0].text} (${response[0].niveau})`);
                  _.each(behaviour.examples, function(example) {
                    let payload = {
                      text: example.text,
                      type: example.type
                    };

                    payload[response[0].type + '_id'] = response[0].id;

                    postRequest(payload).then(function(response) {
                      console.log(`[${response[0].type} #${response[0].id}] ${response[0].text}`);
                    });

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
