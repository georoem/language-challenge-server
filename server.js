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
server.app.db = mongojs('language-challenge:3gOJ3E4cEI5zQslDiKrLtF3bhdVCi6ABf4E21Rs5YfX6wKDK3LzRemttmUK70W89e0F7dzx0KG3nAzBpltCk4Q==@language-challenge.documents.azure.com:10255/?ssl=true&replicaSet=globaldb', ['words','score']);
// server.app.db = mongojs('localhost:27017/local', ['words','score']);
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
