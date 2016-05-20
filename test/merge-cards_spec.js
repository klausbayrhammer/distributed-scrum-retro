"use strict";

const serverFactory = require('../src/server');
const chai = require('chai');
const utils = require('./utils');
const _ = require('lodash');


chai.should();

describe('merge cards', () => {
    let server;
    before(cb => server = serverFactory(cb));

    it('should be able to merge two cards', () => {
        const boardId = 4;
        const card1Promise = utils.addCard(boardId, {
            title: 'teamwork',
            category: 'good'
        });
        const card2Promise = utils.addCard(boardId, {
            title: 'working together',
            category: 'good'
        });
        return Promise.all([card1Promise, card2Promise])
            .then(() => utils.getBoard(boardId))
            .then(data => utils.merge(boardId, _.keys(data)[0], _.keys(data)[1]))
            .then(() => utils.getBoard(boardId))
            .then(utils.firstCard)
            .then(firstCard => {
                firstCard.category.should.equal('good');
                firstCard.title.should.equal('teamwork\n----\nworking together');
            })
    });
    it('should fire delete events and newCard events if card is edited', cb => {
        const boardId = 5;
        let firstCardId;
        let secondCardId;
        const card1Promise = utils.addCard(boardId, {
            title: 'teamwork',
            category: 'good'
        }).then(card => firstCardId = _.keys(card)[0]);
        const card2Promise = utils.addCard(boardId, {
            title: 'working together',
            category: 'good'
        }).then(card => secondCardId = _.keys(card)[0]);
        utils.createSocketIoClient(boardId).then(socketIoClient => {
            const newCardPromise = new Promise(resolve => {
                socketIoClient.on('newCard', data => {
                    data[_.keys(data)[0]].should.deep.equal({title: 'teamwork\n----\nworking together', category: 'good'});
                    resolve();
                });
            });
            const deleteCardIds = _.map([firstCardId, secondCardId], cardId =>  new Promise(resolve => {
                socketIoClient.on('deleteCard', data => {
                    if(data === cardId) {
                        resolve();
                    }
                });
            }));

            Promise.all([card1Promise, card2Promise])
                .then(data => utils.merge(boardId, firstCardId, secondCardId));
            Promise.all(deleteCardIds.concat(newCardPromise)).then(() => cb())
        });
    });
    after(() => {
        server.close();
    })
});