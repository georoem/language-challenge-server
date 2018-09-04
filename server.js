'use strict';
process.env.NODE_ENV = "production";
const Hapi = require('hapi');
// const FirebaseServer = require('firebase-server');
const config = require('config');
var firebase = require("firebase");

var configCredentials = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  };


//Test Firebase Database

// var configCredentials = {
//     databaseURL: `ws://localhost:5000`,
// };

// new FirebaseServer(5000, 'localhost', {
//     challenge:[{
//         "_type": "TRANSLATE_WORD",
//         "_typeTitle": "Translate Word",
//         "_description": "Translate the word in the shortest time",
//         "_color": "#43A047",
//         "_icon": "translate",
//         "_fixedSteps":true,
//         "_numberSteps":10,
//         "_wordsTypeChallenge": [{
//             "_type": "newWord",
//             "_typeTitle": "New Words",
//             "_color": "#43A047",
//             "_icon": "star",
//             "_random": true
//         }]
//     }]
//   });
//End Test Firebase Database

firebase.initializeApp(configCredentials);

const port = process.env.port || 5000;
const host = process.env.host || 'localhost';

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: host, 
    port: port,
    routes: {cors:true}
});

//Connect to db
//let urlDb = config.get('mongo.server.url');
//console.log('Url badabase : '+urlDb);

//server.app.db = mongojs(urlDb, ['words','score','challenge']);
server.app.db=firebase.database();

//Load plugins and start server
server.register([
    require('./routes/words'),
    require('./routes/score'),
    require('./routes/challenge')
    //require('./routes/mongodb/words'),
    //require('./routes/mongodb/score'),
    //require('./routes/mongodb/challenge')
], (err) => {

    if (err) {
        throw err;
    }

    // Start the server
    server.start((err) => {
        console.log('Server running at:', server.info.uri);
    });

});
