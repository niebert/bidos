'use strict';

let app = require('koa')();
let cors = require('koa-cors');
let logger = require('koa-logger');
let helmet = require('koa-helmet');
let compress = require('koa-compress');
let validate = require('koa-validate');
let bodyparser = require('koa-bodyparser');

let chalk = require('chalk');

let routers = require('./routes');
let db = require('./middleware/db');
let auth = require('./middleware/auth');
let mount = require('./lib/mount')(app);
let config = require('./config');

if (require.main === module) {
  app.use(logger());
}

app.use(helmet.defaults());
app.use(compress());
app.use(validate());
app.use(bodyparser());

// inject cors headers
app.use(cors({
  headers: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE']
}));

//                    __   ___      ___         __           ___       __  ___
//       |\/| \ /    |__) |__   /\   |  | |\ | / _`    |__| |__   /\  |__)  |
//       |  |  |     |__) |___ /~~\  |  | | \| \__>    |  | |___ /~~\ |  \  |
//

app.use(db);
mount(routers.public, '/'); // mount public routers
app.use(auth); // authenticate
mount(routers.protected, '/v1/'); // mount protected routers

// main
let listen = function(port) {
  app.listen(port || config.port);
  console.log(`[${chalk.green(new Date().toLocaleTimeString())}] API server running on localhost:${chalk.green(port || config.port)} (${process.env.NODE_ENV.toUpperCase()})`);
};

module.parent ? module.exports = listen : listen();
