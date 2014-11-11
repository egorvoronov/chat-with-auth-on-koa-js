// requires
const session = require('koa-generic-session');
const sessionStore = rootRequire('lib/sessionStore');
const config = rootRequire('config');


// middleware
module.exports = function(app) {

    app.keys = [config.session.secret];
    app.use(session({
        prefix: config.session.prefix,
        key: config.session.key,
        store: sessionStore
    }));

};