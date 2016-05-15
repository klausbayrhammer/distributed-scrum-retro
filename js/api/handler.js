const express = require('express');
const _ = require('lodash');
const db = require('../db/board');
const uuid = require('uuid');

module.exports = function () {
    const router = express.Router();

    router.get('/board/:id/card', (req, res) =>
        res.json(db[req.params.id])
    );

    router.delete('/board/:boardId/card/:cardId', (req, res) => {
        delete db[req.params.boardId][req.params.cardId];
        res.send('Successfully removed card')
    });

    router.post('/board/:boardId/card/:cardId', (req, res) => {
        console.log(req.params);
        db[req.params.boardId][req.params.cardId].title = res.body
        res.send('Successfully edited card');
    });

    router.put('/board/:id/card', (req, res) => {
        const boardId = req.params.id;
        const cardId = uuid.v4();
        const card = {
            title: req.query.title,
            category: req.query.category
        };
        db[boardId][cardId] = card;
        res.json(card);
    });

    return router;
};