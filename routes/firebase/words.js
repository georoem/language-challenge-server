'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/words',
        handler: function (request, reply) {
            db.ref('/words').once('value').then(function(snapshot) {
                reply(snapshotToArray(snapshot));
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/words/wordTypeGroup/{wordType}/{wordGroupId}',
        handler: function (request, reply) {

            db.ref('/words').orderByChild("_wordType").equalTo(request.params.wordType).once('value').then(function(snapshot) {
                filteredWords = snapshotToArray(snapshot).filter(
                    word => {
                        return _wordGroupId == request.params.wordGroupId
                });
                reply(filteredWords);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/words/wordType/{wordType}',
        handler: function (request, reply) {
            db.ref('/words').orderByChild("_wordType").equalTo(request.params.wordType).once('value').then(function(snapshot) {
                reply(snapshotToArray(snapshot));
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/words/{id}',
        handler: function (request, reply) {
            const id = request.params.id;
            db.ref('/words/'+id).once('value').then(function(snapshot) {
                reply(snapshot.val());
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/words/distinct/{field}/{wordType}',
        handler: function (request, reply) {

            db.ref('/words').orderByChild("_wordType").equalTo(request.params.wordType).once('value').then(function(snapshot) {
                let resultArray = snapshotFielfToArray(snapshot, request.params.field);
                let filteredArray = resultArray.filter(
                    (value, index) => {
                        return resultArray.indexOf(value) === index;
                });
                reply(filteredArray);
            });

        }
    });

    server.route({
        method: 'POST',
        path: '/words',
        handler: function (request, reply) {

            const word = request.payload;
            word._id = uuid.v1();
            const result = db.ref('/words').push(word);
            reply(result);
        },
        config: {
            validate: {
                payload: {
                    _word : Joi.string().min(1).max(100).required(), 
                    _wordTranslate : Joi.string().min(1).max(100).required(), 
                    _wordType : Joi.string().min(1).max(100).required(), 
                    _level: Joi.string().min(1).max(3).required()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/words/all',
        handler: function (request, reply) {

            const words = request.payload;

            words.forEach(word => {
                word._id = uuid.v1();
                db.ref('/words').push(word);
            });

            reply(words);
            
        }
    });
    
    server.route({
        method: 'PATCH',
        path: '/words/{id}',
        handler: function (request, reply) {
            const id = request.params.id;
            const word = request.payload;
            const result = db.ref('/words/'+id).set(word);
            reply(result);
        },
        config: {
            validate: {
                payload: Joi.object({
                    payload: {
                        _word : Joi.string().min(1).max(100).optional(), 
                        _wordTranslate : Joi.string().min(1).max(100).optional(), 
                        _wordType : Joi.string().min(1).max(100).optional(), 
                        _level: Joi.string().min(1).max(3).optional()
                    }
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/words/{id}',
        handler: function (request, reply) {
            const id = request.params.id;
            const result = db.ref('/words/'+id).remove(); 
            reply(result);
        }
    });

    return next();
};

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();

        returnArr.push(item);
    });

    return returnArr;
};

function snapshotFielfToArray(snapshot, field) {
    var returnArr = [];
    
    if(!field) return;

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        returnArr.push(item[field]);
    });

    return returnArr;
};

exports.register.attributes = {
    name: 'routes-words'
};
