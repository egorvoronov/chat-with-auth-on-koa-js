// requires
const serve = require('koa-static');

// middleware
module.exports = function(app) {
    app.use(serve('./public'));
};