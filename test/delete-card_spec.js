"use strict";

const serverFactory = require('../src/server');
const chai = require('chai');
const utils = require('./utils');

chai.should();

describe('API integrationtest', () => {

    let server;
    before(cb => server = serverFactory(cb));
    
    describe('delete cards', () => {
        let existingCard;
        let existingCardId;
        const existingBoardId = 3;

        before(() => utils.addCard(existingBoardId, {
            title: 'timwrk',
            category: 'good'
        }).then(data => {
            existingCard = data;
            existingCardId = Object.keys(data)[0];
        }));

        it('should delete cards on delete', () => {
            return utils.deleteCard(existingBoardId, existingCardId)
                .then(() => utils.getBoard(existingBoardId))
                .then(data => {
                    data.should.deep.equal({})
                })
        })
        
        it('should fire deleteCard event if card is deleted', cb => {
            utils.createSocketIoClient(existingBoardId).then(socketIoClient => {
                socketIoClient.on('deleteCard', data => {
                    data.should.deep.equal(existingCardId);
                    cb();
                });
                utils.deleteCard(existingBoardId, existingCardId)
            })
        });
    });

    after(() => {
        server.close();
    })
});