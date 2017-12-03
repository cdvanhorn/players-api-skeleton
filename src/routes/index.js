'use strict';
module.exports = function(app) {
  var usercontroller = require('../controllers/user.js');

  //user routes
  app.route('/api/user')
    .post(usercontroller.create_a_user);
  app.route('/api/login')
    .post(usercontroller.login_user);
};