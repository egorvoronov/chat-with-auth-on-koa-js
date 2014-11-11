// requires
const path = require('path');

// middleware
module.exports = function(app) {

    app.use(function *(next) {

        try {
            yield* next;
        } catch (e) {
            console.error(e);

            // Not authorized
            if(e.status === 401) {
                yield this.render(path.join('error', 'templates', 'notAuthorized'), {
                        title: 'You are not authorized'
                }, true);

                return;
            }

            this.body = e.message;
        }

    });


};