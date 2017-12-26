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

            db.challenge.find((err, docs) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(docs);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/challenge/{id}',
        handler: function (request, reply) {

            db.challenge.findOne({
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
        method: 'GET',
        path: '/challenge/type/{type}',
        handler: function (request, reply) {

            db.score.find({
                _type: request.params.type
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
        path: '/challenge',
        handler: function (request, reply) {

            const challenge = request.payload;

            //Create an id
            challenge._id = uuid.v1();

            db.challenge.save(challenge, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(challenge);
            });
        },
        config: {
            validate: {
                payload: {
                    _type: Joi.string().min(1).max(50).required(),
                    _typeTitle: Joi.string().min(1).max(100).required() , 
                    _description: Joi.string().min(1).max(100).required(),
                    _color: Joi.string().min(1).max(10).required(),
                    _icon: Joi.string().min(1).max(50).required(), 
                    _wordsTypeChallenge: Joi.array().min(1).required()
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/challenge/{id}',
        handler: function (request, reply) {

            db.challenge.update({
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
                        _type: Joi.string().min(1).max(50).optional(),
                        _typeTitle: Joi.string().min(1).max(100).optional() , 
                        _description: Joi.string().min(1).max(100).optional(),
                        _color: Joi.string().min(1).max(10).optional(),
                        _icon: Joi.string().min(1).max(50).optional(), 
                        _wordsTypeChallenge: Joi.array().min(1).optional()
                    }
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/challenge/{id}',
        handler: function (request, reply) {

            db.challenge.remove({
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
    name: 'routes-challenge'
};
