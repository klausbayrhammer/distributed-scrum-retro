"use strict";

const serverFactory = require('../src/server');
const chai = require('chai');
const utils = require('./utils');

chai.should();


describe('add cards', () => {
    
    let server;
    before(cb => server = serverFactory(cb));

    it('should be able to add and retrieve cards', () => {
        const boardId = 1;

        return utils.addCard(boardId, {
                title: 'integration testing',
                category: 'good'
            })
            .then(() => utils.getBoard(boardId))
            .then(data => {
                utils.firstCard(data).should.deep.equal({title: 'integration testing', category: 'good'})
            });
    });
    it('should fire newCard event if card is added', cb => {
        const boardId = 11;
        const card = {title: 'socket.io knowledge', category: 'bad'};
        utils.createSocketIoClient(boardId).then(socketIoClient => {
            socketIoClient.on('newCard', data => {
                utils.firstCard(data).should.deep.equal(card);
                cb();
            });
            utils.addCard(boardId, card);
        })
    });
    it('websocket listeners on other boards should not be notified if new cards are added', cb => {
        const boardIdWithAddedCard = 12;
        const boardIdWithoutCard = 13;
        const card = {title: 'socket.io knowledge', category: 'bad'};
        const socketIoClientToBeNotified = utils.createSocketIoClient(boardIdWithAddedCard);
        socketIoClientToBeNotified.then((socket) => socket.on(`newCard`, data => {
            utils.firstCard(data).should.deep.equal(card);
            cb();
        }));
        const socketIoClientNotNotified = utils.createSocketIoClient(boardIdWithoutCard);
        socketIoClientNotNotified.then((socket) => socket.on('newCard', () => {
            cb(new Error('should not have been called'))
        }));
        Promise.all([socketIoClientNotNotified, socketIoClientNotNotified]).then(() => {
            utils.addCard(boardIdWithAddedCard, card)
        });
    });

    after(() => {
        server.close();
    })
});