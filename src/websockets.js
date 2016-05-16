"use strict";
const socketIo = require('socket.io');

let io;

function init(server) {
    io = socketIo(server);
}

function addCard(boardId, card) {
    io.sockets.emit(`${boardId}/newCard`, card);
}

function deleteCard(card) {
    //TODO
}

module.exports = {
    init: init,
    addCard: addCard,
    deleteCard: deleteCard
};