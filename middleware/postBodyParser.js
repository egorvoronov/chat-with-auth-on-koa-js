// requires
const formidable = require('koa-formidable');


// middleware
module.exports = function(app) {

    app.use(formidable());

};