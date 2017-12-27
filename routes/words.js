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

            db.words.find((err, docs) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(docs);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/words/wordType/{wordType}',
        handler: function (request, reply) {

            db.words.find({
                _wordType: request.params.wordType
            }, (err, doc) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/words/{id}',
        handler: function (request, reply) {

            db.words.findOne({
                _id: request.params.id
            }, (err, doc) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });

        }
    });

    server.route({
        method: 'POST',
        path: '/words/all',
        handler: function (request, reply) {

            const words = request.payload;

            words.forEach(element => {
                //Create an id
                element._id = uuid.v1();
                db.words.save(element, (err, result) => {
                    
                        if (err) {
                            return reply(Boom.wrap(err, 'Internal MongoDB error'));
                        }
        
                    });
            });

            reply(words);
            
        }
    });

    server.route({
        method: 'POST',
        path: '/words',
        handler: function (request, reply) {

            const word = request.payload;

            //Create an id
            word._id = uuid.v1();

            db.words.save(word, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(word);
            });
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
        method: 'PATCH',
        path: '/words/{id}',
        handler: function (request, reply) {

            db.words.update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
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

            db.words.remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-words'
};
