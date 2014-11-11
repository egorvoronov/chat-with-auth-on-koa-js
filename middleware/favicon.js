// requires
const favicon = require('koa-favicon');


// middleware
module.exports = function(app) {
    app.use(favicon());
};