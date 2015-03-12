(function() {
  'use strict';
  // jshint esnext:true

  let _ = require('lodash');
  let Promise = require('bluebird');
  let request = require('superagent');
  let domains = require('./defaults.json');

	if (!process.env.API) {
		console.error('specify API env, e.g. API=92.51.147.239:3000');
		process.exit(1);
	}

  const API = process.env.API;

  function postRequest(payload) {
    console.log([API, payload.type].join('/'));
    return new Promise(function(resolve, reject) {
      request
        .post([API, payload.type].join('/'))
        .send(payload)
        .end(function(res) {
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
