'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');

const port = process.env.port || 1337;

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost', 
    port: port,
    routes: {cors:true}
});

//Connect to db
server.app.db = mongojs('https://language-challenge.documents.azure.com:443', ['words','score']);

//Load plugins and start server
server.register([
    require('./routes/words'),
    require('./routes/score')
], (err) => {

    if (err) {
        throw err;
    }

    // Start the server
    server.start((err) => {
        console.log('Server running at:', server.info.uri);
    });

});
