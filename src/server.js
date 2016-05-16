const app = require('./app');
const websockets = require('./websockets');

module.exports = cb => {
    const server = app.listen(3000, () => {
        console.log('Running on 3000');
        if(cb) {
            cb()
        }
    });
    websockets.init(server);
}
