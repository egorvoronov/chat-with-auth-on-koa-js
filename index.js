// Initializing
require('./init/init');

const path = require('path');
function requireMiddleware(way) {
    rootRequire(path.join('middleware', way))(app);
}

const koa = require('koa');
const app = koa();

// Sending favicon
requireMiddleware('favicon');

// Sending static
requireMiddleware('serve');

// Activating logger
requireMiddleware('logger');

// Catching all errors in one place
requireMiddleware('catchErrors');

// Sessions
requireMiddleware('session');

// Body parser
requireMiddleware('postBodyParser');

// Authentication
requireMiddleware('authentication');

// Jade middleware
requireMiddleware('jade');

// Routing
requireMiddleware('routing');

// Sockets
var server = require('http').createServer(app.callback());
require('./sockets')(server);

// Start
server.listen(3000);
