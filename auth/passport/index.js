const mongoose = require('../../mongoose');
const passport = require('koa-passport');
const co = require('co');
const thunkify = require('thunkify');
var config = rootRequire('config');

var User = require('../../models/user');

// user -> id
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
// id -> user
passport.deserializeUser(function(id, done) {
  try {
    id = mongoose.Types.ObjectId(id);
  } catch(e) { // CastError = not found
    return done(null, null);
  }

  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Local Strategy
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({
  usernameField: 'login',
  passwordField: 'password'
}, function(login, password, done) {

  if (!login) return done(null, false, {message: 'Укажите имя пользователя или email.'});
  if (!password) return done(null, false, {message: 'Укажите пароль.'});

  co(function*() {

    var user = yield User.findOne({login: login}).exec();

    if (!user) {
      return done(null, false, {message: 'Нет такого пользователя.'});
    }

    if (!user.checkPassword(password)) {
      return done(null, false, {message: 'Пароль неверен.'});
    }

    done(null, user);
  })(function(err) {
    if (err) done(err);
  });

}));

// Facebook Strategy
var FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
        clientID: config.facebook.id,
        clientSecret: config.facebook.secret,
        callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        //
        process.nextTick(function () {

            User.findOrCreateUser = thunkify(User.findOrCreateUser);

            co(function*(){
                var user = yield User.findOrCreateUser(profile, callback);

                done(null, user);

            })(function(err){
                if(err) done(err);
            });

            return done(null, profile);
        });
    }

));


module.exports = passport;