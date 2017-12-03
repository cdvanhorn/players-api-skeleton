'use strict';
var mongoose = require('mongoose');
const { User, Player } = require('../models');
const config = require('../config');
const jwt = require('jwt-express');

exports.list_players = function(req, res) {
     //make sure they provided a bearer token, and it's valid
     if (!req.jwt.valid) {
        return res.sendStatus(403);
    }
    var userid = req.jwt.payload.id;
    
    //get the players for this user
    Player.find({created_by: userid}, function(err, players) {
        if(err) {
            //something bad happened
            return res.sendStatus(500);
        }
        return res.status(200).json({
            "success": true,
            "players": players
        });
    });
}

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
    data.created_by = userid;
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