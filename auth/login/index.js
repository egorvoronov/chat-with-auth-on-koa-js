var jade = require('koa-jade');
var path = require('path');

exports.get = function* () {
  yield this.render(path.join('auth', 'template'), {
        title: 'Login',
        buttonName: 'Log In',
        nameOfJsFile: 'login.js',
        action: '/auth/login'
      },
  true);
};

var passport = require('../passport');

exports.post = function*(next) {
  var ctx = this;

  // only callback-form of authenticate allows to assign ctx.body=info if 401
  yield passport.authenticate('local', function*(err, user, info) {
    if (err) throw err;
    if (user === false) {
      ctx.status = 401;
      ctx.body = info;
    } else {
      yield ctx.login(user);
      ctx.body = "";
    }
  }).call(this, next);
};

