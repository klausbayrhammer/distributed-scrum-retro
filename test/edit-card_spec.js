"use strict";

const serverFactory = require('../src/server');
const chai = require('chai');
const utils = require('./utils');

chai.should();

describe('edit cards', () => {
    let existingCard;
    let existingCardId;
    const existingBoardId = 2;
    let server;
    before(cb => {
        server = serverFactory(() => utils.addCard(existingBoardId, {
            title: 'timwrk',
            category: 'good'
        }).then(data => {
            existingCard = data;
            existingCardId = Object.keys(data)[0];
            cb();
        }))
    });

    it('should be able to add and edit cards', () => {
        return utils.editCard(existingBoardId, existingCardId, {title: 'teamwork'})
            .then(() => utils.getBoard(2))
            .then(data => {
                data[existingCardId].should.deep.equal({title: 'teamwork', category: 'good'})
            })
    });
    it('should fire editCard event if card is edited', cb => {
        utils.createSocketIoClient(existingBoardId).then(socketIoClient => {
            socketIoClient.on('editCard', data => {
                data[existingCardId].should.deep.equal({title: 'better teamwork', category: 'good'});
                cb();
            });
            utils.editCard(existingBoardId, existingCardId, {title: 'better teamwork'})
        })
    });
    after(() => {
        server.close();
    })
});