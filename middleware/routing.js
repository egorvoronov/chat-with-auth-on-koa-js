// requires
const router = require('koa-router');
const passport = require('koa-passport');
var checkUser = rootRequire('middleware/checkUser');

// middleware
module.exports = function(app) {

    app.use(router(app));

    // Frontpage
    app.get('/', rootRequire('frontpage').get);

    // Chat page
    app.get('/chat', checkUser, rootRequire('chat').get);

    // Auth
    // register
    app.get('/auth/register', rootRequire('auth/register').get);
    app.post('/auth/register', rootRequire('auth/register').post);

    // login
    app.get('/auth/login', rootRequire('auth/login').get);
    app.post('/auth/login', rootRequire('auth/login').post);

    // facebook login
    app.get('/auth/facebook', passport.authenticate('facebook')); // it's facebook button
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {   // it's facebook callback
        successRedirect: '/',
        failureRedirect: '/auth/login'
    }));


    // logout
    app.post('/auth/logout', rootRequire('auth/logout').post);

};