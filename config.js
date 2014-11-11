Error.stackTraceLimit = 1000;

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

module.exports = {
    "mongoose": {
        "uri": "mongodb://localhost/chat-on-koa-js", // + (process.env.NODE_ENV == 'test' ? "my_test" : "my"),
        "options": {
            "server": {
                "socketOptions": {
                    "keepAlive": 1
                },
                "poolSize": 10
            }
        }
    },
    "session": {
        "prefix": "koa:sess:",
        "key": "sid",
        "secret": "secret yo"
    },
    "facebook": {
        "id": 'your-client-id',
        "secret": 'your-secret'
    }
};