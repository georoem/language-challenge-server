'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/challenge',
        handler: function (request, reply) {
            db.ref('/challenge').once('value').then(function(snapshot) {
                reply(snapshotToArray(snapshot));
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/challenge/{id}',
        handler: function (request, reply) {
            const id = request.params.id;
            db.ref('/challenge/'+id).once('value').then(function(snapshot) {
                reply(snapshot.val());
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/challenge',
        handler: function (request, reply) {

            const challenge = request.payload;
            const result = db.ref('/challenge').push(challenge);
            reply(result);
        }
    });

    server.route({
        method: 'POST',
        path: '/challenge/all',
        handler: function (request, reply) {

            const challenges = request.payload;

            challenges.forEach(challenge => {
                db.ref('/challenge').push(challenge);
            });

            reply(challenges);
            
        }
    });

    server.route({
        method: 'PATCH',
        path: '/challenge/{id}',
        handler: function (request, reply) {
            const id = request.params.id;
            const challenge = request.payload;
            const result = db.ref('/challenge/'+id).set(challenge);
            reply(result);
        }
    });

    server.route({
        method: 'DELETE',
        path: '/challenge/{id}',
        handler: function (request, reply) {
            const id = request.params.id;
            const result = db.ref('/challenge/'+id).remove(); 
            reply(result);
        }
    });

    return next();
};

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        // item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

exports.register.attributes = {
    name: 'routes-challenge'
};
