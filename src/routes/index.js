'use strict';
module.exports = function(app) {
  var usercontroller = require('../controllers/user.js');

  // todoList Routes
  app.route('/api/user')
    .post(usercontroller.create_a_user);
};