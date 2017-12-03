const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = {
  toJSON: {
    transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.user;
    }
  }
};

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
  },
  password: {
    type: String,
    required: true,
    bcrypt: true
  }
}, options);
UserSchema.plugin(require('mongoose-bcrypt'));

//setup email validation for the user
//could have done uniqe validation with mongoose-unique-validator module
var User = mongoose.model('User', UserSchema);
User.schema.path('email').validate({
  isAsync: true,
  validator: function(value, respond) {
    var our_id = this.id;
    User.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user && our_id !== user.id) respond(false);
      respond(true);
    });
  },
  message: 'user with this email already exists'
});

//check if the email is email like
User.schema.path('email').validate(function(value) {
  //this is a very simple validation, could be done with a plugin
  var emailre = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailre.test(value);
}, 'invalid email address');

var PlayerSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  handedness: {
    type: String,
    enum: ['left', 'right'],
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, options);
var Player = mongoose.model('Player', PlayerSchema);

//validate name doesn't already exist
//valdiating on first and last name so validation will get called twice
//if only validate on one, could use update statement to update player
//to have same name as another player
const fullnameValidator = {
  isAsync: true,
  validator: function(value, respond) {
    var last_name = this.last_name;
    var first_name = this.first_name;
    Player.findOne({first_name: first_name, last_name: last_name}, function(err, player) {
      if(err) throw err;
      if(player) respond(false);
      respond(true);
    });
  },
  message: 'player with this name already exists'
};
Player.schema.path('first_name').validate(fullnameValidator);
Player.schema.path('last_name').validate(fullnameValidator);

module.exports = {
  Player: Player,
  User: User
};
