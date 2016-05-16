const express = require('express');
const apiRoute = require('./api');
const websockets = require('./websockets');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use('/api', apiRoute());

module.exports = app;