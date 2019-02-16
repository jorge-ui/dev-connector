var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var keys = require('../../config/keys');
var passport = require('passport');
//models
var User = require('../../models/User');

// Load input validation
var validateRegisterInput = require('../../validation/register');
var validateLoginInput = require('../../validation/login');


// @route   GET api/users/test
// @info    Test if users route works
// @access  Public
router.get('/test', (req, res) => {
  res.json({msg: "users successful!"});
});


// @route   POST api/users/register
// @info    Register a user
// @access  Public
router.post('/register', (req, res) => {
  // Validate register input
  var validation = validateRegisterInput(req.body);
  if(validation.isValid === false) {
    return res.status(400).json(validation.errors); // validation error
  }
  // Find by email
  User.findOne({email: req.body.email})
  .then((foundUser) => {
    // Check if email exist
    if(foundUser) {
      return res.status(400).json({email: 'Email already exist'}) // email already exist
    } else {
      // Create newUser object
      var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      // hash password
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          // save newUser to DB
          newUser.save()
            .then((createdUser) => res.json(createdUser))
            .catch(err => console.log(err));
        });
      });
    }
  });
});


// @route   POST api/users/login
// @info    Login User/ Return JWT Token
// @access  Public
router.post('/login', (req, res) => {
  // Validate register input
  var validation = validateLoginInput(req.body);
  if(validation.isValid === false) {
    return res.status(400).json(validation.errors); // validation error
  }
  // Find by email
  User.findOne({email: req.body.email})
    .then((foundUser) => {
      if(!foundUser) {
          return res.status(404).json({email: "User not found"}); // user not found
      } else {
        // compare password
        bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) => {
          if(isMatch) {
            // password correct, prepare jwt token
            var payload = {id: foundUser.id, name: foundUser.name};
            // sign jwt token
            jwt.sign(payload, keys.jwtSecret, {expiresIn: "1h"}, (err, token) => {
              if (err) throw err;
              // send token
              res.json({
                success: true,
                token: "Bearer " + token
              })
            });
          } else  {
            // password incorrect
            return res.status(400).json({password: "Password incorrect"}); // password incorrect
          }
        });
      }
    });
});


// @route   GET api/users/current
// @info    Return crrent user
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});


module.exports = router;