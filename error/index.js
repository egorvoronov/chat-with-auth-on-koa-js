var path = require('path');
var util = require('util');
var http = require('http');

// errors for user
function HttpError(status, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, this.constructor);

    this.status = status;
    this.message = message || http.STATUS_CODES[status] || "Error";

}

util.inherits(HttpError, Error);

HttpError.prototype.name = 'HttpError';

exports.HttpError = HttpError;