const co = require('co');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const config = rootRequire('config');
const HttpError = rootRequire('error').HttpError;
const sessionStore = rootRequire('lib/sessionStore');
var User = rootRequire('models/user');


// Try to find session and user and save them in handshake store
module.exports = function(socket, next) {
    var handshake = socket.request;

    co(function*() {
        // Get session and save it in handshake object
        handshake.cookies = cookie.parse(handshake.headers.cookie || '');
        var sid = config.session.prefix + handshake.cookies[config.session.key];

        var sessionString = yield* sessionStore.load(sid);
        var session = JSON.parse(sessionString);
        if(!session) {
            next(new HttpError(401, "No session"));
        }
        handshake.session = session;

        // Get user info via session and save him in the handshake object
        var user = yield User.findById(session.passport.user).exec();
        if(!user) {
            next(new HttpError(401, "You are not authorized"));
        }

        handshake.user = user;

        next();

    })(function(err) {
        if(err) {
            console.log(err);

            if (err instanceof HttpError) {
                next();
                return;
            }
            next(err);
        }
    });
};