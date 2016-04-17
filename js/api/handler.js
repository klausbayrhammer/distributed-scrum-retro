const express = require('express');
const mongoose = require('../config/mongo-config');

module.exports = function () {
    const router = express.Router();

    router.get('/board/:id/card', (req, res) => {
        mongoose.models.Card.find({board: req.params.id}).then(data => {
            res.json(data)
        }).catch((err) => {
            res.status(500).send(err);
        })
    });

    router.delete('/board/:boardId/card/:cardId', (req, res) => {
        mongoose.models.Card.remove({board: req.params.boardId, _id: req.params.cardId}).then((res) => {
            res.send('Successfully removed card')
        }).catch((err) => {
            res.status(500).send(err);
        });
    });

    router.put('/board/:id/card', (req, res) => {
        const card = new mongoose.models.Card({board: req.params.id, title:req.query.title, category: req.query.category});
        card.save().then(data => {
            res.json(data);
        }).catch(err => {
            res.status(500).send(err);
        })
    });

    return router;
};