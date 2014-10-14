(function() {
	'use strict';

	module.exports = exports = {

		local_test: {
			app: {
				port: 3000,
				env: 'development'
			},
			session: {
				keys: ['ahqua2ahj0Ci', 'weeghuyeiQu4'],
				cookie: 'livegovwp1-local_test.sid'
			},
			postgres: {
				url: 'pg://localhost/liveandgov_test'
			}
		},

		remote_dev: {
			app: {
				port: 3000,
				env: 'development'
			},
			session: {
				keys: ['aica6EeF7ees', 'phu9Weu8CoeT'],
				cookie: 'livegovwp1-remote_dev.sid'
			},
			postgres: {
				url: 'pg://postgres:liveandgov@localhost:3333/liveandgov_dev'
			}
		}

	};

}());