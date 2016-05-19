const express = require('express');
const db = require('./db/board');
const uuid = require('uuid');
const websockets = require('./websockets');
const _ = require('lodash');

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
        const boardId = req.params.boardId;
        const cardId = req.params.cardId;
        db[boardId][cardId].title = req.query.title;
        websockets.editCard(boardId, _.pick(db[boardId], cardId));
        res.send('Successfully edited card');
    });

    router.put('/board/:id/card', (req, res) => {
        const boardId = req.params.id;
        const cardId = uuid.v4();
        const card = {
            title: req.query.title,
            category: req.query.category
        };
        console.log('adding new card', card);
        db[boardId] = db[boardId] || {};
        db[boardId][cardId] = card;
        response = _.pick(db[boardId], cardId);
        res.json(response);
        websockets.addCard(boardId, response);
    });

    return router;
};