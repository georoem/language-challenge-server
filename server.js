'use strict';
process.env.NODE_ENV = "production";
const Hapi = require('hapi');
const mongojs = require('mongojs');
const config = require('config');

const port = process.env.port || 1337;

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost', 
    port: port,
    routes: {cors:true}
});

//Connect to db
let urlDb = config.get('mongo.server.url');
console.log('Url badabase : '+urlDb);
server.app.db = mongojs(urlDb, ['words','score','challenge']);

//Load plugins and start server
server.register([
    require('./routes/words'),
    require('./routes/score'),
    require('./routes/challenge')
], (err) => {

    if (err) {
        throw err;
    }

    // Start the server
    server.start((err) => {
        console.log('Server running at:', server.info.uri);
    });

});
