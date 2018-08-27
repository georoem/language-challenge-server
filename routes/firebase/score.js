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

            db.ref('/score').once('value').then(function(snapshot) {
               
                filteredScore = sortArrayByField(snapshotToArray(snapshot),"_totalCorrectAnswers", "desc");

                filteredScore = sortArrayByField(filteredScore,"_totalTime", "asc");

                reply(filteredScore);

            });

        }
    });

    server.route({
        method: 'GET',
        path: '/score/level/{level}',
        handler: function (request, reply) {

            db.ref('/score').orderByChild("_level").equalTo(request.params.level).once('value').then(function(snapshot) {
                
                filteredScore = sortArrayByField(snapshotToArray(snapshot),"_totalCorrectAnswers", "desc");

                filteredScore = sortArrayByField(filteredScore,"_totalTime", "asc");

                reply(filteredScore);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/score/challenge/{challengeId}',
        handler: function (request, reply) {

            db.ref('/score').orderByChild("_challengeId").equalTo(request.params.challengeId).once('value').then(function(snapshot) {
                
                filteredScore = sortArrayByField(snapshotToArray(snapshot),"_totalCorrectAnswers", "desc");

                filteredScore = sortArrayByField(filteredScore,"_totalTime", "asc");

                reply(filteredScore);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/score/{id}',
        handler: function (request, reply) {

            const id = request.params.id;
            db.ref('/score/'+id).once('value').then(function(snapshot) {
                reply(snapshot.val());
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/score',
        handler: function (request, reply) {

            const score = request.payload;
            score._id = uuid.v1();
            const result = db.ref('/score').push(score);
            reply(result);
        },
        config: {
            validate: {
                payload: {
                    _user : Joi.string().min(1).max(100).required(), 
                    _totalTime : Joi.number().required(),
                    _level : Joi.string().min(1).max(100).required(),
                    _totalCorrectAnswers : Joi.number().required(),
                    _totalAnswers : Joi.number().required(),
                    _challengeId : Joi.string().min(1).max(100).required()
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/score/{id}',
        handler: function (request, reply) {

            const id = request.params.id;
            const score = request.payload;
            const result = db.ref('/score/'+id).set(score);
            reply(result);
        },
        config: {
            validate: {
                payload: Joi.object({
                    payload: {
                        _user : Joi.string().min(1).max(100).optional(), 
                        _totalTime : Joi.number().optional(),
                        _level : Joi.string().min(1).max(100).optional(),
                        _totalCorrectAnswers : Joi.number().optional(),
                        _totalAnswers : Joi.number().optional(),
                        _challengeId : Joi.string().min(1).max(100).optional()
                    }
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/score/{id}',
        handler: function (request, reply) {

            const id = request.params.id;
            const result = db.ref('/score/'+id).remove(); 
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

function sortArrayByField(arrayItem, field, order) {
    return arrayItem.sort((score1,score2) => {
        if(order==='asc') {
            if (score1[field] > score2[field]) {
                return 1;
            }
            if (score1[field] < score2[field]) {
                return -1;
            }
        }

        if(order==='desc') {
            if (score1[field] < score2[field]) {
                return 1;
            }
            if (score1[field] > score2[field]) {
                return -1;
            }
        }
    
        return 0;
    });
};

exports.register.attributes = {
    name: 'routes-score'
};
