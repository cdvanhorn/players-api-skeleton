var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

var PlayerSchema = new Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  rating: {
    type: Number
  },
  handedness: {
    type: String,
    enum: ['left', 'right']
  }
});

//setup email validation for the user, must be unique and email like
//could have done uniqe validation with mongoose-unique-validator module
var User = mongoose.model('User', UserSchema);
User.schema.path('email').validate({
  isAsync: true,
  validator: function(value, respond) {
    User.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) respond(false);
      respond(true);
    });
  },
  message: 'user with this email already exists'
});
User.schema.path('email').validate(function(value) {
  //this is a very simple validation, could be done with a plugin
  var emailre = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailre.test(value);
}, 'invalid email address');

module.exports = {
  Player: mongoose.model('Player', PlayerSchema),
  User: User
};
