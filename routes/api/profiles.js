var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');

// Models
var Profile = require('../../models/Profile');
var User = require('../../models/User');

// @route   GET api/profiles/test
// @info    Test if profiles route works
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    msg: "profiles successful!"
  });
});

// @route   GET api/profiles/
// @info    Get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  var errors = {};
  // Find by user id
  Profile.findOne({user: req.user.id})
  .then(foundProfile => {
    if(!foundProfile) {
      // profile not found
      errors.noProfile = "There is no profile for this user";
      return res.status(404).json(errors); // not found
    } else {
      // profile found
      res.json(foundProfile); // return profile
    }
  })
  .catch(err => res.status(404).json(err)); // error finding profile
})

module.exports = router;