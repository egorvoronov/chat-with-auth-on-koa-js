const jade = require('koa-jade');
const path = require('path');
const formidable = require('koa-formidable');
var User = rootRequire('models/user');

exports.get = function* () {
    yield this.render(path.join('auth', 'template'), {
            title: 'Registration',
            buttonName: 'Sign In',
            nameOfJsFile: 'register.js',
            action: '/auth/register'
    }, true);
};

var passport = rootRequire('auth/passport');

exports.post = function* (next) {
    var ctx = this;

    var body = this.request.body;

    if(!body.login || !body.password) {
        this.body = 'You should pass login and password';
        this.status = 400;
        return;
    }

    // create user

    var user = new User({
        login: body.login,
        password: body.password
    });

    try {
        user = yield user.persist();

        // save id in session
        yield ctx.login(user);

        // send response to the client
        this.body = {message: 'You are authorized and will be redirected to frontpage'};
        this.status = 200;
    }
    catch (e) {

        if(e.name === 'ValidationError') {

            // if user -> exist -> try to authorize this user
            var regexp = /E11000/;

            if(e.errors.login && e.errors.login.type.indexOf('E11000') !== -1) {
                yield passport.authenticate('local', function*(err, user, info) {
                    if (err) throw err;

                    if (user === false) {
                        ctx.status = 400;
                        ctx.body = {message: 'This user already exist' };
                    } else {
                        yield ctx.login(user);
                        ctx.body = "";
                    }
                }).call(this, next);

            }
        } else {
            throw e;
        }
    }
};
