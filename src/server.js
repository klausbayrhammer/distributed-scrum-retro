const app = require('./app');
const websockets = require('./websockets');
const http = require('http');

module.exports = cb => {
    const server = http.createServer(app);
    server.listen(3000, () => {
        console.log('Running on 3000');
        if (cb) {
            cb()
        }
    })
    websockets.init(server);
    return server;
};
