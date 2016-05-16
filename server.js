const app = require('./src/app');

const server = app.listen(3000, () => {
    console.log('Running on 3000')
});
websockets.init(server);