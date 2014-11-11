const HttpError = rootRequire('error').HttpError;

module.exports = function *(next) {

    if (!this.passport.user) {
        throw new HttpError(401, "You are not authorized");
    }

    yield* next;

};