var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var mongoose = require('mongoose');
var User = require('../models/User');
var keys = require('../config/keys');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.jwtSecret;
opts.ignoreExpiration = true;

module.exports = function (passport) {
   passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
      User.findById(jwtPayload.id)
         .then(foundUser => {
            if (foundUser) {
               return done(null, foundUser);
            } else {
               return done(null, false);
            }
         })
         .catch(err => console.log(err))
   }))
}