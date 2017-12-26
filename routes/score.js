'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/score',
        handler: function (request, reply) {

            db.score.find().sort({ _totalCorrectAnswers: -1, _totalTime : 1 }, (err, docs) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(docs);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/score/level/{level}',
        handler: function (request, reply) {

            db.score.find({
                level: request.params.level
            }).sort({ _totalCorrectAnswers: -1, _totalTime : 1 }, (err, doc) => {

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
        path: '/score/{id}',
        handler: function (request, reply) {

            db.score.findOne({
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
        path: '/score',
        handler: function (request, reply) {

            const score = request.payload;

            //Create an id
            score._id = uuid.v1();

            db.score.save(score, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(score);
            });
        },
        config: {
            validate: {
                payload: {
                    _user : Joi.string().min(1).max(100).required(), 
                    _totalTime : Joi.number().required(),
                    _level : Joi.string().min(1).max(100).required(),
                    _totalCorrectAnswers : Joi.number().required(),
                    _totalAnswers : Joi.number().required()
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/score/{id}',
        handler: function (request, reply) {

            db.score.update({
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
                        _user : Joi.string().min(1).max(100).optional(), 
                        _totalTime : Joi.number().optional(),
                        _level : Joi.string().min(1).max(100).optional(),
                        _totalCorrectAnswers : Joi.number().optional(),
                        _totalAnswers : Joi.number().optional()
                    }
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/score/{id}',
        handler: function (request, reply) {

            db.score.remove({
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
    name: 'routes-score'
};
