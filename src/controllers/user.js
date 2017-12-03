'use strict';
var mongoose = require('mongoose');
const { User } = require('../models');
const config = require('../config');
const jwt = require('jwt-express');

exports.create_a_user = function(req, res) {
    //we're only allowing application/json
    if (!req.is('application/json')) {
        //TODO: make this return a sane error
        res.send('nuts');
    }

    var data = req.body || {};

    //make sure we have a password property and a confirm_password property
    if(!data.hasOwnProperty('password') || !data.hasOwnProperty('confirm_password')) {
        return res.status(409).json({
            "success": false,
            "message": "password required"
        })
    }

    //check to make sure the passwords match
    if(data.password !== data.confirm_password) {
        return res.status(409).json({
            "success": false,
            "message": "password mismatch"
        })
    }

    var user = new User(data);
    user.save(function(err) {
        if(err) {
            return res.status(409).json({
                "success": false,
                "message": err.message
            });
        }
        const token = jwt.create(config.secret, user).token;
        return res.status(201).json({
            "success": true,
            "user": user,
            "token": token
        });
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