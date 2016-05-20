const express = require('express');
const db = require('./db/board');
const uuid = require('uuid');
const websockets = require('./websockets');
const _ = require('lodash');

function deleteCard(boardId, cardId) {
    console.log('delete card', cardId);
    delete db[boardId][cardId];
    websockets.deleteCard(boardId, cardId);
}

function editCard(boardId, cardId, title) {
    db[boardId][cardId].title = title;
    websockets.editCard(boardId, _.pick(db[boardId], cardId));
}

function addCard(title, category, boardId) {
    const cardId = uuid.v4();
    const card = {
        title: title,
        category: category
    };
    console.log('adding new card', card);
    db[boardId] = db[boardId] || {};
    db[boardId][cardId] = card;
    response = _.pick(db[boardId], cardId);
    websockets.addCard(boardId, response);
    return response;
}
module.exports = function () {
    const router = express.Router();

    router.get('/board/:id/card', (req, res) => {
        console.log('get', db[req.params.id]);
        res.json(db[req.params.id])
    });

    router.delete('/board/:boardId/card/:cardId', (req, res) => {
        const cardId = req.params.cardId;
        const boardId = req.params.boardId;
        deleteCard(boardId, cardId);
        res.send('Successfully removed card')
    });

    router.post('/board/:boardId/card/:cardId', (req, res) => {
        const boardId = req.params.boardId;
        const cardId = req.params.cardId;
        const title = req.query.title;
        editCard(boardId, cardId, title);
        res.send('Successfully edited card');
    });

    router.put('/board/:id/card', (req, res) => {
        const boardId = req.params.id;
        const title = req.query.title;
        const category = req.query.category;
        const response = addCard(title, category, boardId);
        res.json(response);
    });

    router.merge('/board/:boardId', (req, res) => {
        const boardId = req.params.boardId;
        const firstCardId = req.query.firstCardId;
        const secondCardId = req.query.secondCardId;
        const firstCardTitle = db[boardId][firstCardId].title;
        const firstCardCategory = db[boardId][firstCardId].category;
        const secondCardTitle = db[boardId][secondCardId].title;
        const newTitle = `${firstCardTitle}\n----\n${secondCardTitle}`;
        deleteCard(boardId, firstCardId);
        deleteCard(boardId, secondCardId);
        addCard(newTitle, firstCardCategory, boardId);
        res.send(`successfully merged cards ${firstCardId} and ${secondCardId}`)
    });

    return router;
};