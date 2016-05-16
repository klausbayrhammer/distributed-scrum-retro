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

describe('API integrationtest', () => {
    before(done => {
        app.listen(3000, () => {
            console.log('Running');
            done();
        });
    });

    it('should be able to list testdata boards', () => {
        return request({uri: 'http://localhost:3000/api/board/1234/card', json:true}).then(data => {
            data.should.deep.equal(testdata)
        })
    })
})