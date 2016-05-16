"use strict";

const app = require('../src/app');
const request = require('request-promise');
const chai = require('chai');
chai.should();

const testdata = {
    '1': {title: 'TDD', category: 'good'},
    '2': {title: 'Pair Programming', category: 'good'},
    '3': {title: 'office temperature', category: 'bad'},
    '4': {title: 'First person in the office turns on the heater', category: 'next action'}
};

const BASE_URL = 'http://localhost:3000/api/board';

function addCard(boardId, card) {
    return request({
        uri: `${BASE_URL}/${boardId}/card`,
        method: 'PUT',
        qs: card,
        json: true
    });
}

function getBoard(boardId) {
    return request({uri: `${BASE_URL}/${boardId}/card`, json: true});
}
describe('API integrationtest', () => {

    before(done => {
        app.listen(3000, () => {
            console.log('Running');
            done();
        });
    });

    it('should be able to list testdata boards', () => {
        return request({uri: BASE_URL + '/1234/card', json: true}).then(data => {
            data.should.deep.equal(testdata)
        })
    });
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

    describe('edit cards', () => {
        let existingCard;
        let existingCardId;

        before(() => addCard(2, {
            title: 'timwrk',
            category: 'good'
        }).then(data => {
            existingCard = data;
            existingCardId = Object.keys(data)[0];
        }));

        it('should be able to add and edit cards', () => {
            return request({uri: `${BASE_URL}/2/card/${existingCardId}`, method: 'POST', qs: {title: 'teamwork'}}
            ).then(() => getBoard(2))
                .then(data => {
                    data[existingCardId].should.deep.equal({title: 'teamwork', category: 'good'})
                })
        })
    })
});