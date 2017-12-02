'use strict';
var mongoose = require('mongoose');
const { User } = require('../models');

exports.create_a_user = function(req, res) {
    //we're only allowing application/json
    if (!req.is('application/json')) {
        //TODO: make this return a sane error
        //TODO: figure out error returning in express
        res.send('nuts');
    }

    User.remove({});
    var data = req.body || {};

    var user = new User(data);
    user.save(function(err) {
        if(err) {
            //do something
        }
        res.sendStatus(201);
    });

    /*
    var new_task = new Task(req.body);
    new_task.save(function(err, task) {
        if (err)
        res.send(err);
        res.json(task);
    });
    */
};