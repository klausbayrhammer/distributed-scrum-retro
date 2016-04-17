const mongoose = require('../js/config/mongo-config');

const testdata = [
    {title: 'TDD', category: 'good', board: '1234'},
    {title: 'Pair Programming', category: 'good', board: '1234'},
    {title: 'office temperature', category: 'bad', board: '1234'},
    {title: 'First person in the office turns on the heater', category: 'next action', board: '1234'}
];

mongoose.models.Card.remove({}, () => {
    mongoose.models.Card.insertMany(testdata, (error, res) => {
        if (error) {
            console.err(error);
        } else {
            console.log(`${res.length} cards have been inserted`);
        }
        mongoose.disconnect();
    });
})
