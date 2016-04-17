const express = require('express');

module.exports = function () {
    const router = express.Router();

    router.get('/board/:id', (req, res) => {
        res.json({
            good: [{title: 'TDD'}, {title: 'Pair Programming'}],
            bad: [{title: 'office temperature'}],
            nextAction: [{title: 'First person in the office turns on the heater'}]
        })
    });
    return router;
};