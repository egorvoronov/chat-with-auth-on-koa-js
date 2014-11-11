const mongoose = require('../mongoose');
const thunkify = require('thunkify');
var hash = require('../lib/hash.js');

var schema = new mongoose.Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String //user may have no password if used facebook to login/register
    },
    salt: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;

        if(password) {
            this.salt = hash.createSalt();
            this.hashedPassword = hash.createHashSlow(password, this.salt);
        } else {
            // remove password (unable to login w/ password any more, but can use providers)
            this.salt = undefined;
            this.hashedPassword = undefined;
        }
    })
    .get(function() {
        return this._plainPassword;
    })
;

schema.methods.checkPassword = function(password) {
    if (!password) return false; // empty password means no login by password
    return hash.createHashSlow(password, this.salt) == this.hashedPassword;
};

function prepareLogin(profile) {
    return [profile.provider, profile.id].join(':');
}

schema.statics.findOrCreateUser = function (profile, callback) {

    var login = prepareLogin(profile);

    User.findOne({ login: login}, onFetchedUser);

    function onFetchedUser(err, user) {
        if(err) return callback(err);

        if(user) {
            // user exist
            return callback(null, user);
        } else {
            // create new db entry and login user
            return User.create({ login: login }, callback);
        }
    }
};

var User = mongoose.model("superuser", schema);
module.exports = User;