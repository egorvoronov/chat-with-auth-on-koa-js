var path = require('path');

exports.get = function* () {

    yield this.render(path.join('frontpage', 'template'), {}, true);
};