var User = require('./models/User');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

module.exports = function(){
  User.deleteMany({}, () => {
    console.log('all users deleted');
    // create newUser object
    var newUser = new User({
      name: "Bogxi",
      email: "test@test.com",
      password: "password"
    });
    // hash password
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash;
        // save on DB
        newUser.save()
          .then((createdUser) => console.log("Created user \"" + createdUser.name + '\"'))
          .catch(err => console.log(err));
      });
    });
});
} 