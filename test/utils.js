"use strict";

const serverFactory = require('../src/server');
const request = require('request-promise');
const chai = require('chai');
const socketIo = require('socket.io-client');

chai.should();

const BASE_URL = `http://localhost:3000`;
const API_URL = `${BASE_URL}/api/board`;

module.exports = {

    addCard: function (boardId, card) {
        return request({
            uri: `${API_URL}/${boardId}/card`,
            method: 'PUT',
            qs: card,
            json: true
        });
    },

    editCard: function (existingBoardId, existingCardId, card) {
        return request({
                uri: `${API_URL}/${existingBoardId}/card/${existingCardId}`,
                method: 'POST',
                qs: card
            }
        );
    },
    deleteCard: function (existingBoardId, existingCardId) {
        return request({
                uri: `${API_URL}/${existingBoardId}/card/${existingCardId}`,
                method: 'DELETE'
            }
        );
    },
    getBoard: function (boardId) {
        return request({uri: `${API_URL}/${boardId}/card`, json: true});
    },

    createSocketIoClient: function (boardId) {
        return new Promise(resolve => {
            const socketIoClient = socketIo.connect(BASE_URL);
            socketIoClient.emit('board', boardId);
            socketIoClient.on('connect', () => {
                resolve(socketIoClient);
            });
        });
    },

    firstCard: function (data) {
        return data[Object.keys(data)[0]];
    }
}