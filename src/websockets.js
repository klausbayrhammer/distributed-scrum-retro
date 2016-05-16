const socketIo = require('socket.io');

var socket;

function init(app) {
    const io = socketIo(app);

    io.on('connection', function (s) {
        socket = s;
    });
}

function addCard(card) {
    socket.broadcast.emit('new card', card);
    socket.emit('new card', card);
}

function deleteCard(card) {
    socket.broadcast.emit('delete card', card);
    socket.emit('delete card', card);
}

module.exports = {
    init: init,
    addCard: addCard,
    deleteCard: deleteCard
};