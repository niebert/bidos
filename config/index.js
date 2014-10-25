(function() {
	'use strict';

	module.exports = exports = {

		development: {
			app: {
				port: 3000,
				env: 'development'
			},
			session: {
				keys: ['ahqua2ahj0Ci', 'weeghuyeiQu4'],
				cookie: 'bidos-dev.sid'
			},
			postgres: {
				url: 'pg://localhost/bidos_dev'
			}
		},

		test: {
			app: {
				port: 3001,
				env: 'test'
			},
			session: {
				keys: ['Eev6xee6', 'Ohzo1poh'],
				cookie: 'bidos-test.sid'
			},
			postgres: {
				url: 'pg://localhost/bidos_test'
			}
		},

		production: {
			app: {
				port: 3002,
				env: 'production'
			},
			session: {
				keys: ['ahXe9Eexai', 'aezahL2Z'],
				cookie: 'bidos-production.sid'
			},
			postgres: {
				url: 'pg://localhost/bidos_production'
			}
		}

	};

}());
