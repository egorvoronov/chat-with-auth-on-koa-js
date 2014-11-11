// requires
const jade = require('koa-jade');
const path = require('path');


// middleware
module.exports = function(app) {

    app.use(jade.middleware());

    app.use(function *(next) {
        var user = this.passport.user;

        jade.configure({
            locals: {user: user},
            viewPath: path.join(__dirname, '..'),
            basedir: path.join(__dirname, '..')
        });

        yield* next;
    });

};