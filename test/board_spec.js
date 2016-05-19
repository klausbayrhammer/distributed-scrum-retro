"use strict";

const serverFactory = require('../src/server');
const request = require('request-promise');
const chai = require('chai');
const socketIo = require('socket.io-client');

chai.should();

const BASE_URL = 'http://localhost:3000/api/board';

function addCard(boardId, card) {
    return request({
        uri: `${BASE_URL}/${boardId}/card`,
        method: 'PUT',
        qs: card,
        json: true
    });
}

function editCard(existingBoardId, existingCardId, card) {
    return request({
            uri: `${BASE_URL}/${existingBoardId}/card/${existingCardId}`,
            method: 'POST',
            qs: card
        }
    );
}

function deleteCard(existingBoardId, existingCardId) {
    return request({
            uri: `${BASE_URL}/${existingBoardId}/card/${existingCardId}`,
            method: 'DELETE'
        }
    );
}

function getBoard(boardId) {
    return request({uri: `${BASE_URL}/${boardId}/card`, json: true});
}

function createSocketIoClient(boardId) {
    return new Promise(resolve => {
        const socketIoClient = socketIo.connect(`http://localhost:3000`);
        socketIoClient.emit('board', boardId);
        socketIoClient.on('connect', () => {
            resolve(socketIoClient);
        });
    });
}

describe('API integrationtest', () => {

    let server;
    before(cb => server = serverFactory(cb));

    describe('add cards', () => {

        it('should be able to add and retrieve cards', () => {
            const boardId = 1;

            return addCard(boardId, {
                title: 'integration testing',
                category: 'good'
            })
                .then(() => getBoard(boardId))
                .then(data => {
                    data[Object.keys(data)[0]].should.deep.equal({title: 'integration testing', category: 'good'})
                });
        });
        it('should fire newCard event if card is added', cb => {
            const boardId = 11;
            const card = {title: 'socket.io knowledge', category: 'bad'};
            createSocketIoClient(boardId).then(socketIoClient => {
                socketIoClient.on('newCard', data => {
                    data[Object.keys(data)[0]].should.deep.equal(card);
                    cb();
                });
                addCard(boardId, card);
            })
        });
        it('websocket listeners on other boards should not be notified if new cards are added', cb => {
            const boardIdWithAddedCard = 12;
            const boardIdWithoutCard = 13;
            const card = {title: 'socket.io knowledge', category: 'bad'};
            const socketIoClientToBeNotified = createSocketIoClient(boardIdWithAddedCard);
            socketIoClientToBeNotified.then((socket) => socket.on(`newCard`, data => {
                data[Object.keys(data)[0]].should.deep.equal(card);
                cb();
            }));
            const socketIoClientNotNotified = createSocketIoClient(boardIdWithoutCard);
            socketIoClientNotNotified.then((socket) => socket.on('newCard', () => {
                cb(new Error('should not have been called'))
            }));
            Promise.all([socketIoClientNotNotified, socketIoClientNotNotified]).then(() => {
                addCard(boardIdWithAddedCard, card)
            });
        })
    });

    describe('edit cards', () => {
        let existingCard;
        let existingCardId;
        const existingBoardId = 2;

        before(() => addCard(existingBoardId, {
            title: 'timwrk',
            category: 'good'
        }).then(data => {
            existingCard = data;
            existingCardId = Object.keys(data)[0];
        }));

        it('should be able to add and edit cards', () => {
            return editCard(existingBoardId, existingCardId, {title: 'teamwork'})
                .then(() => getBoard(2))
                .then(data => {
                    data[existingCardId].should.deep.equal({title: 'teamwork', category: 'good'})
                })
        });
        it('should fire editCard event if card is edited', cb => {
            createSocketIoClient(existingBoardId).then(socketIoClient => {
                socketIoClient.on('editCard', data => {
                    data[existingCardId].should.deep.equal({title: 'better teamwork', category: 'good'});
                    cb();
                });
                editCard(existingBoardId, existingCardId, {title: 'better teamwork'})
            })
        });
    });

    describe('delete cards', () => {
        let existingCard;
        let existingCardId;
        const existingBoardId = 3;

        before(() => addCard(existingBoardId, {
            title: 'timwrk',
            category: 'good'
        }).then(data => {
            existingCard = data;
            existingCardId = Object.keys(data)[0];
        }));

        it('should remove cards on delete', () => {
            return deleteCard(existingBoardId, existingCardId)
                .then(() => getBoard(existingBoardId))
                .then(data => {
                    data.should.deep.equal({})
                })
        })
    })
});