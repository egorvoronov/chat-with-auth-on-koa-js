var path = require('path');

// add rootRequire for comfort usage paths in deep modules
global.rootRequire = function(name) {
    return require(path.join(__dirname, '..', name));
};