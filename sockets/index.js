const currentParticipants = require('./currentParticipants');

module.exports = function (server) {

    var io = require('socket.io')(server);

    io.origins('localhost:*');

    // save user and session in handshake store
    io.use(require('./auth'));

    io.on('connection', function (socket) {
        console.info('socket connection was established');

        var login = socket.request.user.get('login');

        // add this user to current participants
        currentParticipants.push(login);

        // todo pass login to client side and use socket.broadcast.emit
        io.emit('participants', currentParticipants);

        socket.on('message', function (text) {
            io.emit('message', login, text);
        });

        socket.on('disconnect', function () {
            currentParticipants.splice(currentParticipants.indexOf(login), 1);
            socket.broadcast.emit('participants', currentParticipants);
        });


    });


};