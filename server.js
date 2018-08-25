'use strict';
process.env.NODE_ENV = "dev";
const Hapi = require('hapi');
const mongojs = require('mongojs');
const FirebaseServer = require('firebase-server');
const config = require('config');
var firebase = require("firebase");

// var configCredentials = {
//     apiKey: "********************************",
//     authDomain: "language-challenge.firebaseapp.com",
//     databaseURL: "https://language-challenge.firebaseio.com",
//     projectId: "language-challenge",
//     storageBucket: "language-challenge.appspot.com",
//     messagingSenderId: "*****************"
//   };

//Test Firebase Database

var configCredentials = {
    databaseURL: `ws://localhost:5000`,
};

new FirebaseServer(5000, 'localhost', {
    challenge:[{
        "_type": "TRANSLATE_WORD",
        "_typeTitle": "Translate Word",
        "_description": "Translate the word in the shortest time",
        "_color": "#43A047",
        "_icon": "translate",
        "_fixedSteps":true,
        "_numberSteps":10,
        "_wordsTypeChallenge": [{
            "_type": "newWord",
            "_typeTitle": "New Words",
            "_color": "#43A047",
            "_icon": "star",
            "_random": true
        }]
    }]
  });
//End Test Firebase Database

firebase.initializeApp(configCredentials);

const port = process.env.port || 1337;

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost', 
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
   // require('./routes/firebase/words'),
   // require('./routes/firebase/score'),
    require('./routes/firebase/challenge')
    // require('./routes/mongodb/words'),
   // require('./routes/mongodb/score'),
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
