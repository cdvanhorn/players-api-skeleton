'use strict';
const config = require('./config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.listen(config.port, () => {
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
    db.once('open', () => {
        //middleware to parse json body
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        //load routes
        var routes = require('./routes/index');
        routes(app);
        
	    console.log(`Server is listening on port ${config.port}`);
	});
});

module.exports = app;