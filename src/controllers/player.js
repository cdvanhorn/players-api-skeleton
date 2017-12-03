'use strict';
const { Player } = require('../models');
const basecontroller = require('./base');

exports.delete_player = function(req, res) {
  if (!req.jwt.valid) {
    return res.sendStatus(403);
  }

  var userid = req.jwt.payload.id;
  var playerid = req.params.playerId;

  //get the player, have to be created by this user
  Player.findOne({_id: playerid, created_by: userid}, function(err, player) {
    if (err) {
      //invalid id
      return res.sendStatus(404);
    }

    if (!player) {
      //player doesn't exist or we didn't create them
      return res.sendStatus(404);
    }
    player.remove(function(err) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
    });
    return res.sendStatus(200);
  });
};

exports.list_players = function(req, res) {
  //make sure they provided a bearer token, and it's valid
  if (!req.jwt.valid) {
    return res.sendStatus(403);
  }
  var userid = req.jwt.payload.id;

  //get the players for this user
  Player.find({created_by: userid}, function(err, players) {
    if (err) {
      //something bad happened
      console.error(err);
      return res.sendStatus(500);
    }
    return res.status(200).json({
      'success': true,
      'players': players
    });
  });
};

exports.create_a_player = function(req, res) {
  //we're only allowing application/json
  if (!req.is('application/json')) {
    return res.sendStatus(415);
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
    if (err) {
      return basecontroller.sendValidationError(res, err.message);
    }
    return res.status(201).json({
      'success': true,
      'player': player
    });
  });
};