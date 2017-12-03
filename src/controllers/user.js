'use strict';
const { User } = require('../models');
const config = require('../config');
const jwt = require('jwt-express');

exports.login_user = function(req, res) {
  //we're only allowing application/json
  if (!req.is('application/json')) {
    //TODO: make this return a sane error, make this middleware or something
    res.send('nuts');
  }

  var data = req.body || {};

  //TODO: make sure they provided a email and password field
  if (!data.hasOwnProperty('email') || !data.hasOwnProperty('password')) {
    return res.status(409).json({
      'success': false,
      'message': 'email and password required'
    });
  }

  //look up the user by email address
  User.findOne({email: data.email}, function(err, user) {
    if (err) {
      console.error(err);
    }

    //did we actually find a user?
    if (!user) {
      //don't let them know what they messed up
      return res.sendStatus(401);
    }

    //we found a user check the passwords
    user.verifyPassword(data.password, function(err, valid) {
      if (err) {
        console.log(err);
      }

      if (!valid) {
        //don't let them know what they messed up
        return res.sendStatus(401);
      }

      //TODO: abstract this out
      const token = jwt.create(config.secret, user.toJSON()).token;
      return res.status(200).json({
        'success': true,
        'user': user,
        'token': token
      });
    });
  });
};

exports.create_a_user = function(req, res) {
  //we're only allowing application/json
  if (!req.is('application/json')) {
    //TODO: make this return a sane error
    res.send('nuts');
  }

  var data = req.body || {};

  //make sure we have a password property and a confirm_password property
  if (!data.hasOwnProperty('password') || !data.hasOwnProperty('confirm_password')) {
    return res.status(409).json({
      'success': false,
      'message': 'password required'
    });
  }

  //check to make sure the passwords match
  if (data.password !== data.confirm_password) {
    return res.status(409).json({
      'success': false,
      'message': 'password mismatch'
    });
  }

  var user = new User(data);
  user.save(function(err) {
    if (err) {
      return res.status(409).json({
        'success': false,
        'message': err.message
      });
    }
    const token = jwt.create(config.secret, user.toJSON()).token;
    return res.status(201).json({
      'success': true,
      'user': user,
      'token': token
    });
  });
};