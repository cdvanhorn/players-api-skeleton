'use strict';
var usercontroller = require('../controllers/user.js');
var playercontroller = require('../controllers/player.js');

module.exports = function(app) {
  //user routes
  app.route('/api/user')
    .post(usercontroller.create_a_user);
  app.route('/api/login')
    .post(usercontroller.login_user);
  app.route('/api/players')
    .post(playercontroller.create_a_player)
    .get(playercontroller.list_players);
  app.route('/api/players/:playerId')
    .delete(playercontroller.delete_player);
};