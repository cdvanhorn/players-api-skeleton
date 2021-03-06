'use strict';
const config = require('./config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jwt-express');

const app = express();

app.listen(config.port, function() {
  //server is listening let's connect to the database
  mongoose.Promise = global.Promise;
  mongoose.connect(config.db.uri, { useMongoClient: true });

  const db = mongoose.connection;

  //failure to connect let's bail
  db.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  //we're listening and connected to the database
  db.once('open', function() {
    //middleware to parse json body
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    //add configure jwt
    app.use(jwt.init(config.secret, {
      cookies: false
    }));

    //load routes
    var routes = require('./routes/index');
    routes(app);

    if (config.env === 'development') {
      console.log(`Server is listening on port ${config.port}`);
    }
  });
});

module.exports = app;