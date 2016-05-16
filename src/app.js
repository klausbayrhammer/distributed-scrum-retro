const express = require('express');
const apiRoute = require('./api');
const websockets = require('./websockets');

const app = express();

app.use('/api', apiRoute());

module.exports = app;