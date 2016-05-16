const express = require('express');
const apiRoute = require('./api');

const app = express();

app.use('/api', apiRoute());

module.exports = app;