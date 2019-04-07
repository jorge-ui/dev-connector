var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Createa schema
var UserSchema = new Schema({
  googleId: {type: String, default: null},
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  date: {type: Date, default: Date.now},
  handle: {type: String},
  picture: {
     url:{type: String, default: null},
     public_id: {type: String, default: null}
  }
});
var User = mongoose.model('users', UserSchema);

module.exports = User;