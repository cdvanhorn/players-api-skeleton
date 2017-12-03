'use strict';
var mongoose = require('mongoose');
const { User, Player } = require('../models');
const config = require('../config');
const jwt = require('jwt-express');

exports.create_a_player = function(req, res) {
    //we're only allowing application/json
    if (!req.is('application/json')) {
        //TODO: make this return a sane error
        res.send('nuts');
    }

    //make sure they provided a bearer token, and it's valid
    if (!req.jwt.valid) {
        return res.sendStatus(403);
    }

    var data = req.body || {};
    var userid = req.jwt.payload.id;

    //add the user to the player
    data.user = userid;
    var player = new Player(data);
    player.save(function(err) {
        if(err) {
            return res.status(409).json({
                "success": false,
                "message": err.message
            });
        }
        return res.status(201).json({
            "success": true,
            "player": player
        });
    });
}