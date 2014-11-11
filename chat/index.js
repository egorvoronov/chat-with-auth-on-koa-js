var jade = require('koa-jade');
var path = require('path');

exports.get = function* () {
  yield this.render(path.join('chat', 'template'), {}, true);
};