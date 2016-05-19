"use strict";
const socketIo = require('socket.io');

let io;

function init(server) {
    io = socketIo(server);
    io.sockets.on('connection', function(socket) {
        socket.on('board', function(board) {
            socket.join(board);
        });
    });
}

function addCard(boardId, card) {
    io.to(boardId).emit('newCard', card);
}

function deleteCard(card) {
    //TODO
}

function editCard(boardId, card) {
    io.to(boardId).emit('editCard', card);
}

module.exports = {
    init: init,
    addCard: addCard,
    deleteCard: deleteCard,
    editCard: editCard
};