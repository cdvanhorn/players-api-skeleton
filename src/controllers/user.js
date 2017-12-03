'use strict';
const { User } = require('../models');
const config = require('../config');
const jwt = require('jwt-express');
const basecontroller = require('./base');

function sendUser(res, user, status) {
  const token = jwt.create(config.secret, user.toJSON()).token;
  return res.status(status).json({
    'success': true,
    'user': user,
    'token': token
  });
}

exports.login_user = function(req, res) {
  //we're only allowing application/json
  if (!req.is('application/json')) {
    return res.sendStatus(415);
  }

  var data = req.body || {};

  //TODO: make sure they provided a email and password field
  if (!data.hasOwnProperty('email') || !data.hasOwnProperty('password')) {
    return basecontroller.sendValidationError(res, 'email and password required');
  }

  //look up the user by email address
  User.findOne({email: data.email}, function(err, user) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    //did we actually find a user?
    if (!user) {
      //don't let them know what they messed up
      return res.sendStatus(401);
    }

    //we found a user check the passwords
    user.verifyPassword(data.password, function(err, valid) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      if (!valid) {
        //don't let them know what they messed up
        return res.sendStatus(401);
      }

      return sendUser(res, user, 200);
    });
  });
};

exports.create_a_user = function(req, res) {
  //we're only allowing application/json
  if (!req.is('application/json')) {
    return res.sendStatus(415);
  }

  var data = req.body || {};

  //make sure we have a password property and a confirm_password property
  if (!data.hasOwnProperty('password') || !data.hasOwnProperty('confirm_password')) {
    return basecontroller.sendValidationError(res, 'password required');
  }

  //check to make sure the passwords match
  if (data.password !== data.confirm_password) {
    return basecontroller.sendValidationError(res, 'password mismatch');
  }

  var user = new User(data);
  user.save(function(err) {
    if (err) {
      return basecontroller.sendValidationError(res, err.message);
    }
    return sendUser(res, user, 201);
  });
};