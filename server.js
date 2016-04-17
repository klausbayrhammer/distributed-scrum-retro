const express = require('express');
const routes = require('./js/routes');
const apiRoute = require('./js/api/handler');

const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

routes(app);

app.use('/api', apiRoute());

app.listen(3000, () => {
    console.log('Running on 3000')
});